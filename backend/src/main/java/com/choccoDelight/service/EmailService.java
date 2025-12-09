package com.choccoDelight.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String APPLICATION_NAME = "ChoccoDelight Backend";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);

    @Value("${gmail.client.id:}")
    private String clientId;

    @Value("${gmail.client.secret:}")
    private String clientSecret;

    @Value("${gmail.project.id:}")
    private String projectId;

    private Gmail getGmailService() throws IOException, java.security.GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // Construir el JSON de credenciales desde variables de entorno
        String credentialsJson = String.format(
            "{\"installed\":{\"client_id\": \"%s\",\"project_id\": \"%s\",\"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\"token_uri\": \"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\"client_secret\": \"%s\",\"redirect_uris\": [\"http://localhost\"]}}",
            clientId, projectId, clientSecret
        );

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
            JSON_FACTORY, 
            new StringReader(credentialsJson)
        );

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(0).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

        return new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Async
    public CompletableFuture<Boolean> sendEmail(String to, String subject, String bodyText) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Validar que las credenciales estén configuradas
                if (clientId == null || clientId.isEmpty() || 
                    clientSecret == null || clientSecret.isEmpty()) {
                    logger.error("Credenciales de Gmail no configuradas. Configure las variables de entorno GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET y GMAIL_PROJECT_ID");
                    return false;
                }
                
                Gmail service = getGmailService();
                MimeMessage mimeMessage = createEmail(to, "me", subject, bodyText);
                Message message = createMessageWithEmail(mimeMessage);
                service.users().messages().send("me", message).execute();
                
                logger.info("Email enviado exitosamente a: {}", to);
                return true;
                
            } catch (Exception e) {
                logger.error("Error al enviar email a {}: {}", to, e.getMessage());
                
                String errorMsg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
                if (errorMsg.contains("invalid_grant") || errorMsg.contains("expired") || errorMsg.contains("revoked") || errorMsg.contains("401")) {
                    try {
                        File tokenDir = new File(TOKENS_DIRECTORY_PATH);
                        if (tokenDir.exists()) {
                            File[] files = tokenDir.listFiles();
                            if (files != null) {
                                for (File file : files) {
                                    file.delete();
                                }
                            }
                            logger.warn("Token de Google expirado. Tokens eliminados, reinicia el backend.");
                        }
                    } catch (Exception deleteEx) {
                        logger.error("No se pudieron eliminar los tokens automáticamente");
                    }
                }
                
                return false;
            }
        });
    }

    private MimeMessage createEmail(String to, String from, String subject, String bodyText) throws MessagingException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(from));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject);
        email.setContent(bodyText, "text/html; charset=utf-8");
        return email;
    }

    private Message createMessageWithEmail(MimeMessage emailContent) throws MessagingException, IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        emailContent.writeTo(buffer);
        byte[] bytes = buffer.toByteArray();
        String encodedEmail = Base64.encodeBase64URLSafeString(bytes);
        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }
}
