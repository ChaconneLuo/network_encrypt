pub mod rsa_util {
    use openssl::rsa::Rsa;

    #[tauri::command]
    pub fn generate_key(bits: u32) -> (String, String, String, String) {
        let rsa = Rsa::generate(bits).expect("Failed to generate RSA key pair");
        let n = rsa.n().to_string();
        let e = rsa.e().to_string();
        let p = rsa.p().expect("p").to_string();
        let q = rsa.q().expect("q").to_string();
        (p, q, n, e)
    }

    // pub fn encrypt(pub_key: &RsaPublicKey, str: &[u8]) -> String {
    //     let mut rng = rand::thread_rng();
    //     let enc_data = pub_key
    //         .encrypt(&mut rng, Pkcs1v15Encrypt, &str[..])
    //         .expect("failed to encrypt");
    //     String::from_utf8(enc_data).expect("Invalid UTF-8 sequence")
    // }

    // pub fn decrypt(priv_key: &RsaPrivateKey, str: &[u8]) -> String {
    //     let dec_data = priv_key
    //         .decrypt(Pkcs1v15Encrypt, &str)
    //         .expect("failed to decrypt");
    //     String::from_utf8(dec_data).expect("Invalid UTF-8 sequence")
    // }
}
