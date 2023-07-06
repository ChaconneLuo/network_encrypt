pub mod rsa_util {
    use openssl::rsa::Rsa;

    #[tauri::command]
    pub fn generate_key(bits: u32) -> (String, String, String, String, String, String) {
        let rsa = Rsa::generate(bits).expect("Failed to generate RSA key pair");
        let n = rsa.n().to_string();
        let e = rsa.e().to_string();
        let p = rsa.p().expect("p").to_string();
        let q = rsa.q().expect("q").to_string();
        let public = String::from_utf8(rsa.public_key_to_pem().expect("public")).unwrap();
        let private = String::from_utf8(rsa.private_key_to_pem().expect("private")).unwrap();
        (p, q, n, e, public, private)
    }
}

pub mod openssl_util {
    use openssl::asn1::Asn1Time;
    use openssl::hash::MessageDigest;
    use openssl::nid::Nid;
    use openssl::pkey::PKey;
    use openssl::rsa::Rsa;
    use openssl::x509::{X509NameBuilder, X509};

    #[tauri::command]
    pub fn generate_509(
        bits: u32,
        host: &str,
        organization: &str,
        serial: u32,
        days: u32,
    ) -> String {
        // 创建一个新的RSA私钥
        let rsa = Rsa::generate(bits).unwrap();
        let pkey = PKey::from_rsa(rsa).unwrap();

        // 创建一个X509名字构建器
        let mut x509_name = X509NameBuilder::new().unwrap();

        // 添加一些常见的名字条目
        x509_name
            .append_entry_by_nid(Nid::COMMONNAME, &host[..])
            .unwrap();

        x509_name
            .append_entry_by_nid(Nid::ORGANIZATIONNAME, &organization[..])
            .unwrap();
        let x509_name = x509_name.build();

        // 创建一个X509证书构建器
        let mut x509 = X509::builder().unwrap();

        // 设置证书的版本号
        x509.set_version(3).unwrap();

        // 设置证书的序列号
        x509.set_serial_number(
            &openssl::bn::BigNum::from_u32(serial)
                .unwrap()
                .to_asn1_integer()
                .unwrap(),
        )
        .unwrap();

        // 设置证书的主题名
        x509.set_subject_name(&x509_name).unwrap();

        // 设置证书的颁发者名（因为这是一个自签名的证书，所以颁发者就是主题自己）
        x509.set_issuer_name(&x509_name).unwrap();

        // 设置证书的公钥
        x509.set_pubkey(&pkey).unwrap();

        // 设置证书的有效期
        let not_before = Asn1Time::days_from_now(0).unwrap();
        x509.set_not_before(&not_before).unwrap();
        let not_after = Asn1Time::days_from_now(days).unwrap();
        x509.set_not_after(&not_after).unwrap();

        // 使用私钥对证书进行签名
        x509.sign(&pkey, MessageDigest::sha256()).unwrap();

        // 构建证书
        let x509 = x509.build();

        // 打印证书的PEM编码
        let pem = x509.to_pem().unwrap();
        String::from_utf8(pem).unwrap()
    }
}

pub mod socket_util {}
