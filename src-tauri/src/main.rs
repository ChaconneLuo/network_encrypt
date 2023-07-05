// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use network_encrypt::openssl_util::{__cmd__generate_509, generate_509};
use network_encrypt::rsa_util::{__cmd__generate_key, generate_key};
use rand::Rng;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn generate_random_number_list(length: u64, min: u64, max: u64) -> Vec<u64> {
    let mut rng = rand::thread_rng();
    let mut numbers: Vec<u64> = Vec::new();
    for _ in 0..length {
        numbers.push(rng.gen_range(min..max));
    }
    numbers
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            generate_random_number_list,
            generate_key,
            generate_509
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
