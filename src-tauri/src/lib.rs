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

pub mod socket_util {
    use std::net::SocketAddr;
    use tokio::io::AsyncReadExt;
    use tokio::sync::broadcast::Sender;

    use tokio::io::AsyncWriteExt;
    use tokio::net::{TcpSocket, TcpStream};
    use tokio::sync::broadcast::{self};

    async fn process(tcp_stream: &mut TcpStream, tx: &Sender<(String, SocketAddr)>) -> bool {
        let (mut read_half, _write_half) = tcp_stream.split();

        let mut buf = vec![0; 1024];

        //读取消息
        match read_half.read_buf(&mut buf).await {
            Ok(_n) => {
                //转换字符串
                let res = String::from_utf8(buf).unwrap();
                let peer_addr = tcp_stream.peer_addr().unwrap();
                tx.send((res, peer_addr)).unwrap();
                return true;
            }
            Err(err) => {
                println!("err : {:?}", err);
                return false;
            }
        }
    }

    #[tauri::command]
    pub async fn run_server(host: &str) -> Result<(), ()> {
        let addr = host.parse().unwrap();

        let socket = TcpSocket::new_v4().unwrap();
        let _ = socket.bind(addr);
        let listen = socket.listen(1024).unwrap();

        // println!("服务启动成功,端口:5555");

        let (tx, _rx) = tokio::sync::broadcast::channel(1024);

        loop {
            //等待客户端的连接
            let (mut tcp_stream, _) = listen.accept().await.unwrap();

            let tx = tx.clone();
            let mut rx = tx.subscribe();
            //启动线程
            tokio::spawn(async move {
                //循环处理事件
                loop {
                    //只要是返回一个就接结束等待的其他线程
                    tokio::select! {
                        //处理消息
                        result = process(&mut tcp_stream,&tx) => {
                            //如果出现异常结束循环
                            if !result {
                                break;
                            }
                        }
                        //发送消息
                        result = rx.recv() => {
                            let (msg,addr) = result.unwrap();
                            //判断给除了自己的客户端发送消息
                            if addr != tcp_stream.peer_addr().unwrap(){
                                let _ = tcp_stream.write_all(msg.as_bytes()).await;
                            }
                        }
                    }
                }
                //获取客户端地址
                let ip = tcp_stream.peer_addr().unwrap();
                println!("{:?}:断开连接", ip);
            });
        }
    }

    #[tauri::command]
    pub async fn run_client(host: &str) -> Result<(), ()> {
        let socket = TcpSocket::new_v4().unwrap();
        let addr = host.parse().unwrap();
        let mut tcp_stream = socket.connect(addr).await.unwrap();

        let (tx, mut rx) = broadcast::channel(1024);

        //这个地方是因为下面线程中使用后他自动推导不出类型，所以在这个地方添加一个空的字符串
        tx.send(String::new()).unwrap();
        //开启线程处理消息和给服务端发送消息
        tokio::spawn(async move {
            loop {
                let (mut read_half, mut write_half) = tcp_stream.split();
                let mut buf = vec![0; 1024];
                tokio::select! {
                    //读取服务端的消息
                    result = read_half.read_buf(&mut buf) => {
                        match result {
                            Ok(num) => {
                                //这个地方是因为每次接收到消息，总是会出现空消息，如果接收到不是空消息就不是1024大小
                                if num != 1024 {
                                    //转换字符
                                    let content = String::from_utf8(buf).unwrap();
                                    //输出消息
                                    print!("size = {},receive = {}",num,content);
                                }
                            }
                            Err(err) => {
                                println!("服务器连接断开！err={:?}",err);
                                //如果服务端断开则退出程序
                                std::process::exit(0);
                            }
                        }

                    }
                    //读取通道的消息发送给服务端
                    result = rx.recv() => {
                        let send = result.unwrap();
                        //发送给服务端
                        let _ = write_half.write_all(send.as_bytes()).await;
                        let _ = write_half.flush();
                    }
                }
            }
        });
        loop {
            //创建string
            let mut send = String::new();
            //读取控制台文字
            std::io::stdin().read_line(&mut send).unwrap();
            //通过通道发送
            tx.send(send).unwrap();
        }
    }
}
