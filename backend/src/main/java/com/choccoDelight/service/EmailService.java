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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private static final String APPLICATION_NAME = "ChoccoDelight Backend";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

    private Gmail getGmailService() throws IOException, java.security.GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // Load client secrets.
        InputStream in = EmailService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new IOException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

        return new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Async
    public CompletableFuture<Boolean> sendEmail(String to, String subject, String bodyText) {
        return CompletableFuture.supplyAsync(() -> {
            System.out.println("━".repeat(80));
            System.out.println("📧 INICIANDO ENVÍO DE EMAIL");
            System.out.println("   Para: " + to);
            System.out.println("   Asunto: " + subject);
            System.out.println("━".repeat(80));
            
            try {
                // Verificar que existe el archivo de credenciales
                InputStream credentialsCheck = EmailService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
                if (credentialsCheck == null) {
                    System.err.println("❌ No se encontró el archivo credentials.json");
                    return false;
                }
                credentialsCheck.close();
                System.out.println("✓ Archivo credentials.json encontrado");
                
                // Verificar que existe la carpeta de tokens
                File tokensDir = new File(TOKENS_DIRECTORY_PATH);
                if (!tokensDir.exists()) {
                    System.out.println("⚠️  Carpeta 'tokens/' no existe, se creará automáticamente");
                }
                
                System.out.println("🔄 Obteniendo servicio de Gmail...");
                Gmail service = getGmailService();
                System.out.println("✓ Servicio de Gmail obtenido correctamente");
                
                System.out.println("📝 Creando mensaje...");
                MimeMessage mimeMessage = createEmail(to, "me", subject, bodyText);
                Message message = createMessageWithEmail(mimeMessage);
                System.out.println("✓ Mensaje creado");
                
                System.out.println("📤 Enviando email...");
                Message sentMessage = service.users().messages().send("me", message).execute();
                System.out.println("━".repeat(80));
                System.out.println("✅ EMAIL ENVIADO EXITOSAMENTE");
                System.out.println("   ID del mensaje: " + sentMessage.getId());
                System.out.println("   Destinatario: " + to);
                System.out.println("━".repeat(80));
                return true;
                
            } catch (Exception e) {
                System.err.println("━".repeat(80));
                System.err.println("❌ ERROR AL ENVIAR EMAIL");
                System.err.println("   Tipo: " + e.getClass().getSimpleName());
                System.err.println("   Mensaje: " + e.getMessage());
                System.err.println("━".repeat(80));
                e.printStackTrace();
                
                // Si el error es por token expirado, sugerir solución
                String errorMsg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
                if (errorMsg.contains("invalid_grant") || errorMsg.contains("expired") || errorMsg.contains("revoked") || errorMsg.contains("401")) {
                    System.err.println("━".repeat(80));
                    System.err.println("⚠️  TOKEN DE GOOGLE EXPIRADO O REVOCADO");
                    System.err.println("━".repeat(80));
                    System.err.println("Solución:");
                    System.err.println("1. Ejecuta: Remove-Item -Path 'tokens' -Recurse -Force");
                    System.err.println("2. Reinicia el backend");
                    System.err.println("3. Autoriza nuevamente en el navegador");
                    System.err.println("━".repeat(80));
                    
                    // Intentar eliminar el token automáticamente
                    try {
                        File tokenDir = new File(TOKENS_DIRECTORY_PATH);
                        if (tokenDir.exists()) {
                            File[] files = tokenDir.listFiles();
                            if (files != null) {
                                for (File file : files) {
                                    file.delete();
                                }
                            }
                            System.out.println("🗑️  Tokens eliminados. Reinicia el backend.");
                        }
                    } catch (Exception deleteEx) {
                        System.err.println("⚠️  No se pudieron eliminar los tokens automáticamente");
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
