pub mod rsa_util {
    use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};
    pub fn generate_key(bits: u32) -> (RsaPublicKey, RsaPrivateKey) {
        let mut rng = rand::thread_rng();
        let priv_key =
            RsaPrivateKey::new(&mut rng, bits as usize).expect("failed to generate a key");
        let pub_key = RsaPublicKey::from(&priv_key);
        (pub_key, priv_key)
    }

    pub fn encrypt(pub_key: &RsaPublicKey, str: &[u8]) -> String {
        let mut rng = rand::thread_rng();
        let enc_data = pub_key
            .encrypt(&mut rng, Pkcs1v15Encrypt, &str[..])
            .expect("failed to encrypt");
        String::from_utf8(enc_data).expect("Invalid UTF-8 sequence")
    }

    pub fn decrypt(priv_key: &RsaPrivateKey, str: &[u8]) -> String {
        let dec_data = priv_key
            .decrypt(Pkcs1v15Encrypt, &str)
            .expect("failed to decrypt");
        String::from_utf8(dec_data).expect("Invalid UTF-8 sequence")
    }
}
