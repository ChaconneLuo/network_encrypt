pub mod rsaUtil {
    use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};
    pub fn generateKey(bits: number) -> (&str, &str) {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let priv_key = RsaPrivateKey::new(&mut rng, bits).expect("failed to generate a key");
        let pub_key = RsaPublicKey::from(&priv_key);
        (pub_key, priv_key)
    }

    pub fn encrypt(pub_key: &str, str: &str) {
        let enc_data = pub_key
            .encrypt(&mut rng, Pkcs1v15Encrypt, &str[..])
            .expect("failed to encrypt");
    }

    pub fn decrypt(priv_key: &str, str: &str) {
        let dec_data = priv_key
            .decrypt(Pkcs1v15Encrypt, &str)
            .expect("failed to decrypt");
    }
}
