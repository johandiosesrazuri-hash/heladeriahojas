package com.choccoDelight.dto;

public class PaymentInfoDTO {
    private YapeInfo yape;
    private BankInfo bank;

    public PaymentInfoDTO() {}

    public PaymentInfoDTO(YapeInfo yape, BankInfo bank) {
        this.yape = yape;
        this.bank = bank;
    }

    public static class YapeInfo {
        private String qrPath;

        public YapeInfo() {}

        public YapeInfo(String qrPath) {
            this.qrPath = qrPath;
        }

        public String getQrPath() {
            return qrPath;
        }

        public void setQrPath(String qrPath) {
            this.qrPath = qrPath;
        }
    }

    public static class BankInfo {
        private String name;
        private String account;
        private String cci;
        private String holder;
        private String type;

        public BankInfo() {}

        public BankInfo(String name, String account, String cci, String holder, String type) {
            this.name = name;
            this.account = account;
            this.cci = cci;
            this.holder = holder;
            this.type = type;
        }

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

    public YapeInfo getYape() {
        return yape;
    }

    public void setYape(YapeInfo yape) {
        this.yape = yape;
    }

    public BankInfo getBank() {
        return bank;
    }

    public void setBank(BankInfo bank) {
        this.bank = bank;
    }
}
