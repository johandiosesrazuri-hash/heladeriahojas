package com.choccoDelight.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payment")
public class PaymentConfig {
    
    private Yape yape = new Yape();
    private Bank bank = new Bank();

    public static class Yape {
        private Qr qr = new Qr();

        public static class Qr {
            private String path = "/img/qr-yape.png";

            public String getPath() {
                return path;
            }

            public void setPath(String path) {
                this.path = path;
            }
        }

        public Qr getQr() {
            return qr;
        }

        public void setQr(Qr qr) {
            this.qr = qr;
        }
    }

    public static class Bank {
        private String name = "BCP";
        private String account = "47503225658098";
        private String cci = "00247510322565809828";
        private String holder = "JOHAN ALEJANDRO DIOSES RAZURI";
        private String type = "Ahorros Soles";

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAccount() {
            return account;
        }

        public void setAccount(String account) {
            this.account = account;
        }

        public String getCci() {
            return cci;
        }

        public void setCci(String cci) {
            this.cci = cci;
        }

        public String getHolder() {
            return holder;
        }

        public void setHolder(String holder) {
            this.holder = holder;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    public Yape getYape() {
        return yape;
    }

    public void setYape(Yape yape) {
        this.yape = yape;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }
}
