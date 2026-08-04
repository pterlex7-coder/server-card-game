// ================================================
// CARD GAME NUSANTARA - FULL SERVER v2
// judul skripsi : PENGEMBANGAN MEDIA WEBSITE CARD GAME NUSANTARA MATERI DAERAHKU KEBANGGAANKU PADA MATA PELAJARAN IPAS KELAS V SD
// server.js - Converted from Deno (main.ts) to Node.js
// ================================================

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// =============================================
// DATA KARTU & PROVINSI
// =============================================
const ALL_PROVINCES = [
    { name: "Aceh", cards: [
        { name: "Kopi Gayo",                  type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Masjid Raya Baiturrahman",   type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertanian Kopi",             type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumoh Aceh",                 type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Rencong",                    type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Ulee Balang",                type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Serune Kalee",               type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Saman",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Peusijuek",                  type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Mie Aceh",                   type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sumatera Utara", cards: [
        { name: "Karet & Kelapa Sawit",       type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Istana Maimun",              type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Sawit",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Bolon",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Piso Gaja Dompak",           type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Ulos",                       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gondang Sabangunan",         type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Tor-Tor",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Mangulosi",                  type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Bika Ambon",                 type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sumatera Barat", cards: [
        { name: "Gambir & Kulit Manis",       type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Jam Gadang",                 type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perdagangan Rempah",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Gadang",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Karih",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Bundo Kanduang",             type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Saluang",                    type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Piring",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Batagak Penghulu",           type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Rendang",                    type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Riau", cards: [
        { name: "Minyak Bumi",                type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Istana Siak",                type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Minyak",        type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Selaso Jatuh Kembar",  type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pedang Jenawi",              type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Teluk Belanga",              type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gambus",                     type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Zapin",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Tepuk Tepung Tawar",         type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Gulai Belacan",              type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kepulauan Riau", cards: [
        { name: "Bauksit & Timah",            type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Bukit Kursi",       type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perikanan Laut",             type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Belah Bubung",         type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Badik Tumbuk Lada",          type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kebaya Labuh",               type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gong",                       type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Tandak",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Mandi Safar",                type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Otak-otak",                  type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Jambi", cards: [
        { name: "Batubara & Karet",           type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Candi Muaro Jambi",          type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Karet",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Kajang Leko",          type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Siginjai",             type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Baju Kurung Tanggung",       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Kelintang",                  type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Sekapur Sirih",         type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Betangas",                   type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Tempoyak",                   type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Bengkulu", cards: [
        { name: "Batubara & Emas",            type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Marlborough",        type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Batu Bara",     type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Bubungan Lima",        type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Rudus",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pakaian Rejang Lebong",      type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Dol",                        type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Andun",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Bimbang Adat",               type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Pendap",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sumatera Selatan", cards: [
        { name: "Minyak & Gas Bumi",          type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Jembatan Ampera",            type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Minyak",        type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Limas",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Tombak Trisula",             type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Aesan Gede",                 type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Accordion Palembang",        type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Tanggai",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Nganggung",                  type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Pempek",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Bangka Belitung", cards: [
        { name: "Timah",                      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Kuto Panji",         type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Timah",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Rakit",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Siwar",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pakaian Seting",             type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Dambus",                     type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Sepen",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Buang Jong",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Lempah Kuning",              type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Lampung", cards: [
        { name: "Kopi Robusta Lampung",       type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Menara Siger",               type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Kopi",            type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Nuwou Sesat",          type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Terapang",                   type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pakaian Tulang Bawang",      type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gamolan Pekhing",            type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Sigeh Penguten",        type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Cangget",                    type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Seruit",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "DKI Jakarta", cards: [
        { name: "Sumber Daya Laut (Perikanan)",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Stadhuis",                   type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perdagangan & Jasa",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Kebaya",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Golok",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kebaya Encim",               type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tehyan",                     type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Yapong",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Palang Pintu",               type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Kerak Telor",                type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Jawa Barat", cards: [
        { name: "Teh & Kina",                 type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Keraton Kasepuhan Cirebon",  type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Teh",             type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Kasepuhan",            type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Kujang",                     type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kebaya Sunda",               type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Angklung",                   type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Jaipong",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Seren Taun",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Karedok",                    type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Banten", cards: [
        { name: "Baja & Industri",            type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Masjid Agung Banten",        type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Industri Baja",              type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Baduy",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Golok Ciomas",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pakaian Pangsi",             type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Dogdog Lojor",               type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Cokek",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Seba Baduy",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Sate Bandeng",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Jawa Tengah", cards: [
        { name: "Lahan Pertanian (Padi)",     type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Candi Borobudur",            type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Industri Tekstil",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Joglo",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kebaya Jawa",                type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gamelan",                    type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Serimpi",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Sekaten",                    type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Lumpia",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "DI Yogyakarta", cards: [
        { name: "Material Vulkanik (Pasir dan Batuan)", type: "Sumber Daya Alam", rarity: "mythic", power: 10 },
        { name: "Keraton Yogyakarta",         type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Industri Kerajinan",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Bangsal Kencono",            type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Yogyakarta",           type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kebaya Kesatrian",           type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gamelan Yogyakarta",         type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Kumbang",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Labuhan Merapi",             type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Gudeg",                      type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Jawa Timur", cards: [
        { name: "Garam & Tembakau",           type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Candi Penataran",            type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Industri Garam",             type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Situbondo",            type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Clurit",                     type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pesa'an",                    type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Saronen",                    type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Remo",                  type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Karapan Sapi",               type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Rujak Cingur",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Bali", cards: [
        { name: "Kopi Kintamani",             type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Pura Besakih",               type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pariwisata Budaya",          type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Gapura Candi Bentar",  type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Bali",                 type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Payas Agung",                type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Gamelan Bali",               type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Pendet",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Ngaben",                     type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Ayam Betutu",                type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Nusa Tenggara Barat", cards: [
        { name: "Mutiara Lombok",             type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Istana Dalam Loka",          type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Budidaya Mutiara",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Dalam Loka",           type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris NTB",                  type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Lambung",                    type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Serunai NTB",                type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Gandrung",              type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Bau Nyale",                  type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Ayam Taliwang",              type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Nusa Tenggara Timur", cards: [
        { name: "Kopi Flores & Cendana",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Portugis Solor",     type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Peternakan Sapi",            type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Musalaki",             type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Sundu",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pakaian Amarasi",            type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Sasando",                    type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Caci",                  type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Pati Ka",                    type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Se'i",                       type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kalimantan Barat", cards: [
        { name: "Bauksit & Emas",             type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Keraton Kadriyah Pontianak", type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Bauksit",       type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Panjang",              type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Mandau",                     type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "King Baba",                  type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Sape",                       type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Monong",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Naik Dango",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Bubur Pedas",                type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kalimantan Tengah", cards: [
        { name: "Rotan & Kayu Ulin",          type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Istana Kuning Sampit",       type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Kehutanan & Rotan",          type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Betang",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Mandau Kalteng",             type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Sangkarut",                  type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Garantung",                  type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Giring-giring",         type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Tiwah",                      type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Juhu Singkah",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kalimantan Selatan", cards: [
        { name: "Intan & Batubara",           type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Masjid Sultan Suriansyah",   type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Intan",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Bubungan Tinggi",      type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Banjar",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Babaju Kun Galung",          type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Panting",                    type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Baksa Kembang",         type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Aruh Ganal",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Soto Banjar",                type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kalimantan Timur", cards: [
        { name: "Minyak & Gas Kaltim",        type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Keraton Kutai Kartanegara",  type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Migas",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Lamin",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Mandau Kaltim",              type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Kustin",                     type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Sape Kaltim",                type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Gong",                  type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Erau",                       type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Ayam Cincane",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Kalimantan Utara", cards: [
        { name: "Gas Alam & Kelapa Sawit",    type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Tarakan",            type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perikanan & Kehutanan",      type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Baloy",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Mandau Kalut",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Ta'a",                       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Sampe",                      type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Jepen",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Iraw Tengkayu",              type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Kepiting Soka",              type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sulawesi Utara", cards: [
        { name: "Kelapa & Cengkeh",           type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Moraya",             type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perikanan Laut",             type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Walewangko",           type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Sulut",                type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Laku Tepu",                  type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Kolintang",                  type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Maengket",              type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Tulude",                     type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Bubur Manado",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Gorontalo", cards: [
        { name: "Jagung & Ikan Tuna",         type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Otanaha",            type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertanian Jagung",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Dulohupa",             type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Wamilo",                     type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Biliu",                      type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Polopalo",                   type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Polopalo",              type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Molonthalo",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Binte Biluhuta",             type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sulawesi Tengah", cards: [
        { name: "Nikel & Emas Sulteng",       type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Masjid Tua Luwuk",           type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Nikel",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Tambi",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pasatimpo",                  type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Koje",                       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Ganda",                      type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Lumense",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Balia",                      type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Kaledo",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sulawesi Barat", cards: [
        { name: "Kakao & Kelapa Sulbar",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Istana Malaweg",             type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Kakao",           type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Boyang",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Badik Sulbar",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pattuqduq Towaine",          type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Kecapi Sulbar",              type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Patuddu",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Sayyang Pattu'du",           type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Bau Peapi",                  type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sulawesi Selatan", cards: [
        { name: "Nikel & Besi Sulsel",        type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Rotterdam",          type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Nikel",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Tongkonan",            type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Badik",                      type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Baju Bodo",                  type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Kecapi Sulsel",              type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Kipas Pakarena",        type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Rambu Solo",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Coto Makassar",              type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Sulawesi Tenggara", cards: [
        { name: "Nikel & Aspal Buton",        type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Keraton Buton",      type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Aspal",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Istana Buton",         type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Keris Sultra",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Babu Nggawi",                type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Ladolado",                   type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Lulo",                  type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Posuo",                      type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Lapa-lapa",                  type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Maluku", cards: [
        { name: "Pala & Cengkeh Maluku",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Belgica Banda",      type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perkebunan Rempah",          type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Baileo",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Parang Salawaku",            type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Baju Cele",                  type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa",                       type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Cakalele",              type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Pukul Sapu",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Papeda",                     type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Maluku Utara", cards: [
        { name: "Nikel & Cengkeh Malut",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Benteng Tolukko Ternate",    type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Nikel",         type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Sasadu",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Parang Malut",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Manteren Lamo",              type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Malut",                 type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Lenso",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Kololi Kie",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Gohu Ikan",                  type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua", cards: [
        { name: "Emas & Tembaga Freeport",    type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Tugu MacArthur Jayapura",    type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Pertambangan Emas",          type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Honai",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Belati Papua",         type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Koteka",                     type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Papua",                 type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Musyoh",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Bakar Batu",                 type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Papeda Papua",               type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua Barat", cards: [
        { name: "Gas Alam & Ikan Laut",       type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Tugu Jepang Manokwari",      type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perikanan & Migas",          type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Mod Aki Aksa",         type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Pabar",                type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Ewer",                       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Pabar",                 type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Suanggi",               type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Wor",                        type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Ikan Bakar Manokwari",       type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua Selatan", cards: [
        { name: "Kayu & Hasil Hutan",         type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Penjara Boven Digoel",       type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Kehutanan",                  type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Gotad",                type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Pasel",                type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Pummi",                      type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Pasel",                 type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Gatzi",                 type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Yi Ha",                      type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Sagu Sep",                   type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua Tengah", cards: [
        { name: "Emas & Hasil Hutan Pateng",  type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Kampung Tua Mosandurei",     type: "Tempat Bersejarah",   rarity: "legendary",   power: 9 },
        { name: "Pertanian & Kehutanan",      type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Karapao",              type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Pateng",               type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Sali",                       type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Pateng",                type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Yuw",                   type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Bakar Batu Pateng",          type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Sagu Bakar",                 type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua Pegunungan", cards: [
        { name: "Hasil Hutan & Kopi",         type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Lembah Baliem",              type: "Tempat Bersejarah",   rarity: "legendary",   power: 9 },
        { name: "Pertanian Pegunungan",       type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Honai Pegunungan",     type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Peg",                  type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Yokal",                      type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Pikon",                      type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Selamat Datang",        type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Festival Lembah Baliem",     type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Udang Selingkuh",            type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
    { name: "Papua Barat Daya", cards: [
        { name: "Ikan & Mutiara Sorong",      type: "Sumber Daya Alam",        rarity: "mythic",      power: 10 },
        { name: "Pillbox",                    type: "Bangunan Bersejarah", rarity: "legendary",   power: 9 },
        { name: "Perikanan & Pariwisata",     type: "Sektor Ekonomi",      rarity: "rareplus",    power: 7 },
        { name: "Rumah Kambik",               type: "Rumah Adat",          rarity: "epic",        power: 8 },
        { name: "Pisau Pabarday",             type: "Senjata Tradisional", rarity: "rarestar",    power: 6 },
        { name: "Boe",                        type: "Pakaian Adat",        rarity: "rare",        power: 5 },
        { name: "Tifa Pabarday",              type: "Alat Musik",          rarity: "uncommon",    power: 4 },
        { name: "Tari Aluyen",                type: "Tarian",              rarity: "uncommonplus",power: 3 },
        { name: "Injak Piring",               type: "Adat Istiadat",       rarity: "commonplus",  power: 2 },
        { name: "Ikan Kuah Kuning",           type: "Makanan Khas",        rarity: "common",      power: 1 },
    ]},
];

const ALL_CARDS = [];
ALL_PROVINCES.forEach(province => {
    province.cards.forEach(card => {
        ALL_CARDS.push({ ...card, province: province.name, id: `${province.name}-${card.name}` });
    });
});

// =============================================
// UTILITIES
// =============================================
function sanitizeName(name) {
    if (typeof name !== 'string') return '';
    return name.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 30);
}

// =============================================
// DRAW CARD LEVEL SYSTEM
// =============================================
const DRAW_RATES = {
    1: { common: 22, commonplus: 16, uncommonplus: 13, uncommon: 11, rare: 10, rarestar: 9, rareplus: 8, epic: 6, legendary: 4, mythic: 1 },
    2: { commonplus: 21, common: 16, uncommonplus: 15, uncommon: 13, rare: 11, rarestar: 10, rareplus: 7, epic: 4, legendary: 2, mythic: 1 },
    3: { uncommonplus: 20, uncommon: 14, commonplus: 15, common: 13, rare: 12, rarestar: 11, rareplus: 8, epic: 4, legendary: 2, mythic: 1 },
    4: { uncommon: 19, uncommonplus: 15, commonplus: 13, common: 11, rare: 13, rarestar: 12, rareplus: 9, epic: 5, legendary: 2, mythic: 1 },
    5: { rare: 18, uncommon: 14, rarestar: 13, uncommonplus: 13, rareplus: 11, commonplus: 11, common: 10, epic: 8, legendary: 1, mythic: 1 },
    6: { rarestar: 17, rare: 14, uncommon: 13, rareplus: 12, uncommonplus: 11, commonplus: 10, epic: 9, common: 9, legendary: 4, mythic: 1 },
    7: { rareplus: 16, rarestar: 14, rare: 13, uncommon: 11, epic: 12, uncommonplus: 10, commonplus: 9, common: 8, legendary: 5, mythic: 2 },
    8: { epic: 15, rareplus: 14, rarestar: 13, legendary: 11, rare: 11, uncommon: 10, uncommonplus: 9, commonplus: 8, common: 7, mythic: 2 },
    9: { legendary: 17, epic: 13, rareplus: 12, rarestar: 11, rare: 10, uncommon: 9, uncommonplus: 8, commonplus: 7, common: 6, mythic: 7 },
    10: { mythic: 20, legendary: 17, epic: 14, rareplus: 11, rarestar: 10, rare: 9, uncommon: 7, uncommonplus: 6, commonplus: 4, common: 2 }
};
const RARITY_ORDER = ['mythic','legendary','epic','rareplus','rarestar','rare','uncommon','uncommonplus','commonplus','common'];
const LEVEL_NAMES = { 1:'Lv1', 2:'Lv2', 3:'Lv3', 4:'Lv4', 5:'Lv5', 6:'Lv6', 7:'Lv7', 8:'Lv8', 9:'Lv9', 10:'Lv10' };

function calcDrawLevel(drawCount) {
    return Math.min(drawCount + 1, 10);
}

// =============================================
// FIREBASE REST API CLIENT
// =============================================
const FB_DB_URL = process.env.FIREBASE_DATABASE_URL
    || "https://rex-server-8a176-default-rtdb.asia-southeast1.firebasedatabase.app";

let fbServiceAccount = null;
let fbTokenCache = null;

(function loadServiceAccount() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) { console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT tidak diset — rank disimpan oleh client sebagai fallback"); return; }
    try { fbServiceAccount = JSON.parse(raw); console.log("✅ Firebase service account loaded"); }
    catch (e) { console.error("❌ FIREBASE_SERVICE_ACCOUNT JSON invalid:", e); }
})();

const { createSign } = require('crypto');

async function fbGetToken() {
    if (!fbServiceAccount) return null;
    const now = Math.floor(Date.now() / 1000);
    if (fbTokenCache && fbTokenCache.expiry > now + 60) return fbTokenCache.token;
    try {
        const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
            .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        const header  = { alg: "RS256", typ: "JWT" };
        const payload = {
            iss: fbServiceAccount.client_email, sub: fbServiceAccount.client_email,
            aud: "https://oauth2.googleapis.com/token",
            iat: now, exp: now + 3600,
            scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email"
        };
        const input = `${b64url(header)}.${b64url(payload)}`;
        const sign = createSign('RSA-SHA256');
        sign.update(input);
        const sigB64 = sign.sign(fbServiceAccount.private_key, 'base64')
            .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        const jwt = `${input}.${sigB64}`;
        const resp = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
        });
        const json = await resp.json();
        if (!json.access_token) throw new Error(JSON.stringify(json));
        fbTokenCache = { token: json.access_token, expiry: now + 3590 };
        return fbTokenCache.token;
    } catch (e) { console.error("❌ fbGetToken error:", e); return null; }
}

async function fbTransaction(path, updateFn) {
    const token = await fbGetToken();
    if (!token) return false;
    const url = `${FB_DB_URL}${path}.json`;
    for (let attempt = 0; attempt < 3; attempt++) {
        const getRes = await fetch(url, { headers: { Authorization: `Bearer ${token}`, "X-Firebase-ETag": "true" } });
        const etag   = getRes.headers.get("ETag") ?? "*";
        const cur    = await getRes.json();
        const next   = updateFn(cur === null ? undefined : cur);
        if (next === undefined) return false;
        const putRes = await fetch(url, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "if-match": etag },
            body: JSON.stringify(next)
        });
        if (putRes.ok) return true;
        if (putRes.status === 412) continue;
        const errText = await putRes.text().catch(() => "");
        console.error(`❌ fbTransaction PUT failed ${putRes.status}: ${errText}`);
        return false;
    }
    return false;
}

async function fbPush(path, value) {
    const token = await fbGetToken();
    if (!token) return false;
    const res = await fetch(`${FB_DB_URL}${path}.json`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(value)
    });
    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`❌ fbPush POST failed ${res.status} path=${path}: ${errText}`);
    }
    return res.ok;
}

async function fbSet(path, value) {
    const token = await fbGetToken();
    if (!token) return false;
    const res = await fetch(`${FB_DB_URL}${path}.json`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(value)
    });
    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`❌ fbSet PUT failed ${res.status}: ${errText}`);
    }
    return res.ok;
}

async function fbRead(path) {
    const token = await fbGetToken();
    if (!token) return null;
    const res = await fetch(`${FB_DB_URL}${path}.json`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json().catch(() => null);
}

// =============================================
// RANK SYSTEM
// =============================================
const RANKS = [
    "Bronze III", "Bronze II", "Bronze I",
    "Silver III", "Silver II", "Silver I",
    "Gold III",   "Gold II",   "Gold I",
    "Diamond III","Diamond II","Diamond I",
    "Platinum III","Platinum II","Platinum I",
    "Platinum MAX"
];
const RANK_CHANGES = {
    Bronze:   [60, 30, 15, -10],
    Silver:   [48, 24, 12, -17],
    Gold:     [36, 18,  9, -24],
    Diamond:  [24, 12,  6, -31],
    Platinum: [15,  6,  3, -40],
};
function rankTier(name) {
    if (name === "Platinum MAX") return "Platinum";
    return ["Bronze","Silver","Gold","Diamond","Platinum"].find(t => name.startsWith(t)) || "Bronze";
}
function calcRank(name, pts, pos) {
    const change = RANK_CHANGES[rankTier(name)][pos - 1];
    const idx    = RANKS.indexOf(name);
    let np = pts + change, nn = name;
    if (np >= 100 && idx < RANKS.length - 1) { nn = RANKS[idx + 1]; np -= 100; }
    else if (np < 0) { if (name === "Bronze III") np = 0; else { nn = RANKS[idx - 1]; np = Math.max(0, 100 + np); } }
    return { name: nn, pts: np };
}

async function savePlayerStats(userUid, playerName, position) {
    if (!fbServiceAccount || !userUid || userUid === "BOT") return false;
    try {
        const base = `/users/${userUid}`;
        let _rankBefore = "Bronze III", _rankAfter = "Bronze III", _ptsChange = 0, _ptsBefore = 0, _ptsAfter = 0;
        let _peakRank = "Bronze III";
        const rankOk = await fbTransaction(`${base}/rankData`, (r) => {
            if (!r) r = { rankName: "Bronze III", points: 0, peakRank: "Bronze III", peakRankIndex: 0 };
            _rankBefore = r.rankName || "Bronze III";
            _ptsBefore  = r.points   || 0;
            _ptsChange  = RANK_CHANGES[rankTier(_rankBefore)][position - 1];
            const res   = calcRank(_rankBefore, _ptsBefore, position);
            _rankAfter  = res.name;
            _ptsAfter   = res.pts;
            r.rankName  = res.name; r.points = res.pts;
            const ni    = RANKS.indexOf(res.name);
            if (ni > (r.peakRankIndex || 0)) {
                r.peakRank = res.name; r.peakRankIndex = ni; r.peakRankPoints = res.pts;
            } else if (res.name === r.peakRank && res.pts > (r.peakRankPoints || 0)) {
                r.peakRankPoints = res.pts;
            }
            _peakRank = r.peakRank || res.name;
            return r;
        });
        let _updatedStats = null;
        let _currentStreak = 0;
        const statsOk = await fbTransaction(`${base}/stats`, (s) => {
            if (!s) s = { totalMatches: 0, rank1: 0, rank2: 0, rank3: 0, rank4: 0, winStreak: 0 };
            s.totalMatches = (s.totalMatches || 0) + 1;
            s[`rank${position}`] = (s[`rank${position}`] || 0) + 1;
            // Hitung win streak: posisi 1-3 = menang, posisi 4 = kalah (streak reset)
            if (position <= 3) {
                s.winStreak = (s.winStreak || 0) + 1;
            } else {
                s.winStreak = 0;
            }
            _currentStreak = s.winStreak;
            _updatedStats = { ...s };
            return s;
        });
        let histOk = false;
        for (let hi = 0; hi < 3 && !histOk; hi++) {
            if (hi > 0) await new Promise(r => setTimeout(r, 800));
            histOk = await fbPush(`${base}/history`, {
                rank: position, date: Date.now(),
                rankBefore: _rankBefore, rankAfter: _rankAfter,
                ptsBefore: _ptsBefore, ptsAfter: _ptsAfter, ptsChange: _ptsChange
            });
        }
        const freshRank = await fbRead(`${base}/rankData`);
        const _finalRankName = freshRank?.rankName ?? _rankAfter;
        const _finalPts      = freshRank?.points   ?? _ptsAfter;
        const _finalPeakRank = freshRank?.peakRank  ?? _peakRank;
        const lbOk = await fbSet(`/leaderboard/${userUid}`, {
            name: playerName,
            rankName: _finalRankName,
            points:   _finalPts,
            peakRank: _finalPeakRank,
            totalMatches: _updatedStats?.totalMatches ?? 0,
            rank1: _updatedStats?.rank1 ?? 0,
            rank2: _updatedStats?.rank2 ?? 0,
            rank3: _updatedStats?.rank3 ?? 0,
            rank4: _updatedStats?.rank4 ?? 0,
            updatedAt: Date.now()
        });
        const ok = statsOk && histOk && rankOk;
        console.log(`${ok ? "✅" : "⚠️ "} savePlayerStats uid=${userUid} pos=${position} stats=${statsOk} hist=${histOk} rank=${rankOk} lb=${lbOk}`);
        return ok;
    } catch (e) {
        console.error(`❌ savePlayerStats uid=${userUid}:`, e);
        return false;
    }
}

async function saveProvinceStats(provinces, players, roomId, isCustomRoom) {
    if (!fbServiceAccount || provinces.length === 0) return;
    try {
        await fbTransaction('/provinceStats/totalMatches', (cur) => (cur ?? 0) + 1);
        const humanPlayers = players.filter(p => !p.isBot).map(p => `${p.name} (${p.userUid})`);
        await fbPush('/provinceStats/history', {
            timestamp: Date.now(), matchId: roomId, isCustomRoom, provinces, players: humanPlayers
        });
        console.log(`✅ saveProvinceStats roomId=${roomId}`);
    } catch (e) {
        console.error(`❌ saveProvinceStats error:`, e);
    }
}

async function pickWeightedProvinces() {
    const MANDATORY = 'Bangka Belitung';
    const candidates = ALL_PROVINCES.filter(p => p.name !== MANDATORY);
    let selected = [];
    const ok = await fbTransaction('/provinceStats/counts', (cur) => {
        const counts = { ...(cur ?? {}) };
        const sorted = [...candidates].sort((a, b) => (counts[a.name] ?? 0) - (counts[b.name] ?? 0));
        const cutoff = counts[sorted[10].name] ?? 0;
        const definiteIn = sorted.filter(p => (counts[p.name] ?? 0) < cutoff).map(p => p.name);
        const tied = sorted.filter(p => (counts[p.name] ?? 0) === cutoff).map(p => p.name);
        const need = 11 - definiteIn.length;
        const fromTied = [...tied].sort(() => Math.random() - 0.5).slice(0, need);
        selected = [...definiteIn, ...fromTied];
        for (const name of selected) counts[name] = (counts[name] ?? 0) + 1;
        return counts;
    });
    if (!ok || selected.length < 11) {
        console.warn('⚠️ pickWeightedProvinces fallback ke random murni');
        return [...candidates].sort(() => Math.random() - 0.5).slice(0, 11).map(p => p.name);
    }
    return selected;
}

// =============================================
// GAME ENGINE
// =============================================
class GameEngine {
    constructor(roomId) {
        this.roomId = roomId;
        this.onGameOver = undefined;
        this.selectedProvinces = [];
        this.isCustomRoom = false;
        this.spectatorSockets = [];
        this.spectatorUserUids = [];
        this._spectatorLeft = null;
        this._spectatorReconnectTimer = undefined;
        this.gs = {
            round: 1, phase: 1, phase1Player: null,
            drawPile: [], discardPile: [], topCard: [],
            currentProvince: null, players: [],
            forcePickMode: false, forcePickPlayers: [],
            forcePickProcessing: false, isHandlingForcePick: false,
            isEndingRound: false, isStartingPhase: false,
            currentRoundPlays: [], roundHistory: [],
            winners: [], gameOver: false, surrenderCount: 0,
            drawTurnQueue: [], drawTurnIndex: 0, isProcessingDrawTurn: false, drawTurnActive: false,
            isPaused: false
        };
        this.hostUserUid = null; // UID host custom room (yang bisa pause)
    }

    // ── PAUSE / RESUME (khusus host penonton custom match) ──────────────
    handlePause(requestingUserUid) {
        if (!this.isCustomRoom) return { success: false, error: 'Pause hanya tersedia di Custom Match.' };
        if (requestingUserUid !== this.hostUserUid) return { success: false, error: 'Hanya host yang dapat pause pertandingan.' };
        if (this.gs.gameOver) return { success: false, error: 'Pertandingan sudah selesai.' };
        this.gs.isPaused = !this.gs.isPaused;
        const action = this.gs.isPaused ? 'PAUSED' : 'RESUMED';
        this.broadcastLog(`${this.gs.isPaused ? '⏸️' : '▶️'} Pertandingan di${this.gs.isPaused ? 'jeda' : 'lanjutkan'} oleh host.`);
        this.broadcastToAll({ type: 'GAME_PAUSE_STATE', isPaused: this.gs.isPaused, action });
        this.broadcastGameState();
        return { success: true, isPaused: this.gs.isPaused };
    }

    addSpectator(socket, userUid) {
        this.spectatorSockets.push(socket);
        if (userUid && !this.spectatorUserUids.includes(userUid)) this.spectatorUserUids.push(userUid);
        this._spectatorLeft = false;
    }

    removeSpectator(socket, userUid) {
        this.spectatorSockets = this.spectatorSockets.filter(s => s !== socket);
        // [FIX KRITIS] spectatorUserUids TIDAK boleh dihapus saat socket disconnect biasa.
        // Sebelumnya UID dihapus di sini -> saat spectator reconnect (terutama setelah koneksi
        // terputus lama), rejoinAsSpectator gagal cek includes(userUid) -> return false ->
        // server kirim ERROR -> client tampilkan "Pertandingan sudah berakhir" padahal
        // pertandingan masih berjalan dan belum di-cleanup.
        // UID hanya boleh dihapus oleh markSpectatorLeft() ketika spectator benar-benar
        // keluar secara sengaja (klik tombol Kembali ke Home).
        if (this.spectatorSockets.length === 0) {
            if (this._spectatorReconnectTimer) { clearTimeout(this._spectatorReconnectTimer); this._spectatorReconnectTimer = undefined; }
            console.log(`Spectator socket disconnect -- UID dipertahankan untuk reconnect. Match tetap berjalan.`);
        }
    }

    setSelectedProvinces(provinces) { this.selectedProvinces = provinces; }

    addPlayer(p) {
        const player = {
            id: p.id, name: p.name, isBot: p.isBot, socket: p.socket,
            hand: [], totalPower: 0, hasPlayed: false, mustDraw: false,
            mustForcePick: false, freed: false, winner: false, rank: 0,
            isProcessingAction: false, autoMode: false, userUid: p.userUid || '',
            leftMatch: false, statsSaved: false, botLevel: p.botLevel,
            drawLevel: 1, drawCount: 0,
            drawProb: 0, mustPlayMatching: false
        };
        this.gs.players.push(player);
    }

    addBot(name, level = 1) {
        this.addPlayer({ id: `bot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name, isBot: true, userUid: 'BOT', botLevel: level });
    }

    static get BOT_NAMES() {
        return ['Miya','Nayla','Aldi','Marcel','Zoe','Kara','Mega','Genta','Flex','Angel','Teorita','Miko','Luba','Nana','Kong','Walka','Ace','Aero','Astro','Axel','Blaze','Bolt','Blade','Cyra','Dash','Draco','Echo','Enzo','Falcon','Flash','Frost','Ghost','Helix','Hunter','Ion','Jett','Kai','Kenzo','Kyra','Leo','Lynx','Max','Neo','Nova','Onyx','Orion','Phoenix','Pyro','Quest','Raptor','Raven','Rex','Rogue','Shadow','Sky','Sonic','Spark','Storm','Titan','Turbo','Vector','Viper','Volt','Wolf','Xander','Zero','Saka','Rimba','Guntur','Kilat','Bayu','Tirta','Satria','Arga','Bumi','Langit','Mentari','Surya','Bintang','Jagat','Nusa','Wira'];
    }

    static pickBotName() {
        if (!GameEngine._usedBotNames) GameEngine._usedBotNames = [];
        const available = GameEngine.BOT_NAMES.filter(n => !GameEngine._usedBotNames.includes(n));
        const pool = available.length > 0 ? available : GameEngine.BOT_NAMES;
        const name = pool[Math.floor(Math.random() * pool.length)];
        GameEngine._usedBotNames.push(name);
        if (GameEngine._usedBotNames.length > GameEngine.BOT_NAMES.length) GameEngine._usedBotNames = [];
        return name;
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    getActivePlayers() { return this.gs.players.filter(p => !p.winner); }
    updatePower(p) { p.totalPower = p.hand.reduce((s, c) => s + c.power, 0); }

    checkWin(player) {
        if (player.hand.length === 0 && !player.winner) {
            player.winner = true;
            const takenRanks = new Set(this.gs.winners.map(w => w.rank));
            let rank = 1;
            while (takenRanks.has(rank)) rank++;
            player.rank = rank;
            this.gs.winners.push(player);
            const medals = ['🥇','🥈','🥉','🎖️'];
            this.broadcastLog(`${medals[player.rank-1] || '🏅'} ${player.name} MENANG! Peringkat: ${player.rank}`);
            if (!player.isBot && player.userUid && player.userUid !== "BOT" && !player.statsSaved && !this.isCustomRoom) {
                player.statsSaved = true;
                const _p = player;
                savePlayerStats(_p.userUid, _p.name, _p.rank).then(ok => {
                    if (ok) {
                        if (_p.socket && _p.socket.readyState === WebSocket.OPEN) {
                            try { _p.socket.send(JSON.stringify({ type: 'STATS_SAVED', rank: _p.rank })); } catch (_) {}
                        }
                    } else {
                        _p.statsSaved = false;
                        if (_p.socket && _p.socket.readyState === WebSocket.OPEN) {
                            try { _p.socket.send(JSON.stringify({ type: 'SAVE_STATS_CLIENT', rank: _p.rank })); } catch (_) {}
                        } else {
                            _p.statsSaved = true;
                            setTimeout(() => {
                                savePlayerStats(_p.userUid, _p.name, _p.rank).then(ok2 => {
                                    if (!ok2) _p.statsSaved = false;
                                }).catch(e => { _p.statsSaved = false; });
                            }, 2000);
                        }
                    }
                }).catch(e => { player.statsSaved = false; });
            }
        }
    }

    clearAfkTimer(p) { if (p.afkTimer) { clearTimeout(p.afkTimer); p.afkTimer = undefined; } }
    clearAllAfkTimers() { this.gs.players.forEach(p => this.clearAfkTimer(p)); }

    setAfkTimer(player, action, delay = 25000) {
        this.clearAfkTimer(player);
        if (player.isBot) return;
        player.afkTimer = setTimeout(() => {
            if (!this.gs.gameOver && !this.gs.isPaused) { this.broadcastLog(`⏰ ${player.name} AFK - aksi otomatis`); action(); }
        }, delay);
    }

    logDrawLevels() {
        const active = this.getActivePlayers();
        if (active.length === 0) return;
        const logParts = active.map(p => `${p.name}: ${LEVEL_NAMES[p.drawLevel]}(${p.drawCount} draws)`);
        this.broadcastLog(`📊 Draw Level: ${logParts.join(' | ')}`);
        // Tampilkan stok kartu tersisa per provinsi di drawPile — SERVER ONLY (tidak dikirim ke pemain)
        const provinceStock = {};
        for (const card of this.gs.drawPile) {
            provinceStock[card.province] = (provinceStock[card.province] || 0) + 1;
        }
        const stockParts = Object.entries(provinceStock)
            .sort((a, b) => b[1] - a[1])
            .map(([prov, count]) => `${prov}: ${count}`)
            .join(' | ');
        const totalRemaining = this.gs.drawPile.length;
        console.log(`📝 LOG: 📦 Kartu Tersisa (${totalRemaining} total): ${stockParts || 'Kosong'}`);
    }

    dealCard(player, maxRetry = 50) {
        // ── KEAMANAN: Lock untuk mencegah draw kartu duplikat saat bersamaan ──
        // drawPile diakses satu per satu secara sinkron (Node.js single-threaded),
        // namun kita tetap validasi ulang ketersediaan kartu setelah setiap remove.
        if (this.gs.drawPile.length === 0) {
            player.mustForcePick = true; player.mustDraw = false;
            this.broadcastLog(`⚠️ Draw Pile habis! ${player.name} → Force Pick`);
            return false;
        }
        // Bangun set semua kartu yang sudah dipegang: tangan semua pemain + topCard
        // Ini memastikan tidak ada kartu yang sama bisa diberikan ke dua pemain,
        // bahkan jika drawPile belum di-update saat pemain lain baru saja draw.
        const usedIds = new Set([
            ...this.gs.topCard.map(c => c.id),
            ...this.gs.players.flatMap(p => p.hand.map(c => c.id))
        ]);
        // Filter drawPile: hanya kartu yang benar-benar belum dimiliki siapapun
        const availableCards = this.gs.drawPile.filter(c => !usedIds.has(c.id));
        if (availableCards.length === 0) {
            player.mustForcePick = true; player.mustDraw = false;
            this.broadcastLog(`⚠️ Draw Pile habis! ${player.name} → Force Pick`);
            return false;
        }

        // ── STEP 1: Probabilitas provinsi cocok (+19.8% per draw, cap 99%) ──
        player.drawProb = Math.min(0.99, (player.drawProb || 0) + 0.198);
        const prob = player.drawProb;

        const matchingCards    = availableCards.filter(c => c.province === this.gs.currentProvince);
        const nonMatchingCards = availableCards.filter(c => c.province !== this.gs.currentProvince);

        // Tentukan apakah draw ini akan dapat kartu satu provinsi dengan top card
        const useMatching = matchingCards.length > 0 && Math.random() < prob;

        const level = player.drawLevel ?? 1;
        const rateTable = DRAW_RATES[level] ?? DRAW_RATES[1];

        // Helper: pilih kartu terbaik dari pool berdasarkan rarity tertinggi yang tersedia (sesuai DRAW_RATES level)
        // Urutkan rarity dari tertinggi ke terendah berdasarkan nilai rate di level tersebut
        function pickByHighestRarity(pool) {
            if (pool.length === 0) return null;
            // Urutkan RARITY_ORDER berdasarkan nilai rate tertinggi di level ini (desc)
            const rarityBySortedRate = [...RARITY_ORDER].sort((a, b) => (rateTable[b] ?? 0) - (rateTable[a] ?? 0));
            for (const rarity of rarityBySortedRate) {
                const candidates = pool.filter(c => c.rarity === rarity);
                if (candidates.length > 0) {
                    // Jika ada beberapa kartu dengan rarity sama, pilih acak di antara mereka
                    return candidates[Math.floor(Math.random() * candidates.length)];
                }
            }
            // Fallback jika tidak ada yang cocok sama sekali
            return pool[Math.floor(Math.random() * pool.length)];
        }

        let chosen;
        if (useMatching) {
            // ── DAPAT KARTU SATU PROVINSI: pilih rarity tertinggi yang tersedia di matchingCards ──
            // Periksa dari rarity dengan rate tertinggi di level ini, turun satu per satu
            chosen = pickByHighestRarity(matchingCards);
        } else {
            // ── TIDAK DAPAT KARTU SATU PROVINSI ──
            const pool = nonMatchingCards.length > 0 ? nonMatchingCards : matchingCards;
            // Prioritaskan rarity tertinggi dari pool non-matching sesuai level draw card
            chosen = pickByHighestRarity(pool);
        }

        // Hapus dari drawPile dan tambahkan ke tangan
        const idx = this.gs.drawPile.indexOf(chosen);
        if (idx !== -1) this.gs.drawPile.splice(idx, 1);
        player.hand.push(chosen);
        this.updatePower(player);
        player.drawCount++;
        const newLevel = calcDrawLevel(player.drawCount);
        if (newLevel > player.drawLevel) {
            player.drawLevel = newLevel;
            this.broadcastLog(`⬆️ ${player.name} naik ke Draw ${LEVEL_NAMES[newLevel]}! (${player.drawCount} draws)`);
        }
        // ── Tentukan rarity tertinggi yang masih tersedia di drawPile (setelah kartu ini diambil) ──
        // Hierarki: mythic > legendary > epic > rareplus > rarestar > rare > uncommon > uncommonplus > commonplus > common
        const RESET_HIERARCHY = ['mythic','legendary','epic','rareplus','rarestar','rare','uncommon','uncommonplus','commonplus','common'];
        function getHighestAvailableRarity(drawPile) {
            const remaining = new Set(drawPile.map(c => c.rarity));
            for (const r of RESET_HIERARCHY) { if (remaining.has(r)) return r; }
            return null;
        }
        const highestInPile = getHighestAvailableRarity(this.gs.drawPile);
        const shouldReset = (highestInPile !== null && chosen.rarity === highestInPile)
                         || (highestInPile === null && level >= 10);
        if (shouldReset) {
            const resetReason = highestInPile ? chosen.rarity.toUpperCase() : 'Lv10 (drawPile habis)';
            player.drawLevel = 1;
            player.drawCount = 0;
            player.drawProb = 0;
            this.broadcastLog(`\uD83D\uDD04 ${player.name} dapat [${resetReason}] (tertinggi)! Draw Level reset ke Lv1.`);
        }
        const probPct  = Math.round(prob * 100);
        const isMatch  = chosen.province === this.gs.currentProvince;
        const modeStr  = useMatching ? `✅ Cocok [prob ${probPct}%]` : `❌ Non-Cocok [prob ${probPct}%]`;
        this.broadcastLog(`🎴 ${player.name} [${LEVEL_NAMES[level]}] draw: ${chosen.name} (${chosen.rarity}/${chosen.province}) ${modeStr}`);
        return true;
    }

    startGame() {
        const cardsPool = this.selectedProvinces.length > 0
            ? ALL_CARDS.filter(c => this.selectedProvinces.includes(c.province))
            : ALL_CARDS;
        this.gs.drawPile = this.shuffle([...cardsPool]);

        // DEAL: 8 kartu per pemain, 1 kartu dari tiap rarity (epic → common)
        // Mythic & Legendary tidak dibagikan di awal — terlalu kuat, hanya bisa didapat via draw
        const DEAL_RARITIES = ['epic', 'rareplus', 'rarestar', 'rare', 'uncommon', 'uncommonplus', 'commonplus', 'common'];

        this.gs.players.forEach(player => {
            const usedRarities = new Set(); // rarity yang sudah dipegang pemain ini

            for (const targetRarity of DEAL_RARITIES) {
                // Ambil semua kartu di drawPile dengan rarity ini yang belum dimiliki pemain lain
                const candidates = this.gs.drawPile.filter(c => c.rarity === targetRarity);

                if (candidates.length === 0) {
                    console.error(`❌ startGame: tidak ada kartu rarity "${targetRarity}" tersisa untuk ${player.name}`);
                    continue;
                }

                // Pilih acak dari kandidat yang ada
                const chosen = candidates[Math.floor(Math.random() * candidates.length)];
                this.gs.drawPile.splice(this.gs.drawPile.indexOf(chosen), 1);
                player.hand.push(chosen);
                usedRarities.add(targetRarity);
                this.updatePower(player);
            }
        });

        this.broadcastLog(`🎮 Game dimulai! Setiap pemain mendapat 8 kartu (1 kartu tiap rarity: epik → dasar). Mistik & Legendaris hanya via draw card.`);
        setTimeout(() => this.startPhase1(), 500);
    }

    startPhase1() {
        if (this.gs.gameOver || this.gs.isStartingPhase) return;
        this.gs.isStartingPhase = true;
        this.gs.phase = 1;
        this.gs.topCard = []; this.gs.currentProvince = null;
        this.gs.currentRoundPlays = [];
        this.gs.forcePickMode = false; this.gs.forcePickPlayers = [];
        this.gs.forcePickProcessing = false; this.gs.isHandlingForcePick = false;
        this.gs.drawTurnQueue = []; this.gs.drawTurnIndex = 0; this.gs.drawTurnActive = false; this.gs.isProcessingDrawTurn = false;
        this.gs.players.forEach(p => {
            p.hasPlayed = false; p.mustDraw = false; p.mustForcePick = false;
            p.freed = false; p.isProcessingAction = false;
            p.drawProb = 0; p.mustPlayMatching = false;
            p.drawTurnIndex = 0; p.drawOnceNoMatch = false;
            this.clearAfkTimer(p);
        });
        setTimeout(() => { this.gs.isStartingPhase = false; }, 100);
        this.logDrawLevels();
        if (this.gs.round === 1) {
            this.broadcastGameState();
            setTimeout(() => this.systemPlayPhase1(), 800);
            return;
        }
        const lastRound = this.gs.roundHistory[this.gs.roundHistory.length - 1];
        const validPlays = (lastRound?.plays || []).filter(play => {
            if (play.power === 0) return false;
            if (play.isForcePickPlay) return false;
            const p = this.gs.players.find(p => p.id === play.playerId);
            return p && !p.winner;
        });
        if (validPlays.length === 0) {
            this.broadcastGameState();
            setTimeout(() => this.systemPlayPhase1(), 800);
            return;
        }
        validPlays.sort((a, b) => b.power - a.power);
        const phase1Player = this.gs.players.find(p => p.id === validPlays[0].playerId);
        if (!phase1Player || phase1Player.winner) {
            this.broadcastGameState();
            setTimeout(() => this.systemPlayPhase1(), 800);
            return;
        }
        this.gs.phase1Player = phase1Player.id;
        this.broadcastLog(`🎯 👤 ${phase1Player.name} mendapat giliran Tahap 1!`);
        if (phase1Player.isBot) {
            this.broadcastGameState();
            setTimeout(() => this.botPlayPhase1(phase1Player), 1000);
        } else {
            this.setAfkTimer(phase1Player, () => {
                if (!phase1Player.hasPlayed) this.setPlayerAutoMode(phase1Player.id, true, 'AFK');
            });
            this.broadcastGameState();
            if (phase1Player.autoMode) setTimeout(() => this.runAutoAction(phase1Player), 500);
        }
    }

    systemPlayPhase1() {
        if (this.gs.isPaused) { setTimeout(() => this.systemPlayPhase1(), 1000); return; }
        let card;
        if (this.gs.drawPile.length > 0) {
            card = this.gs.drawPile.pop();
        } else if (this.gs.discardPile.length > 0) {
            card = this.gs.discardPile.splice(Math.floor(Math.random() * this.gs.discardPile.length), 1)[0];
            this.broadcastLog(`♻️ Draw Pile habis! Ambil dari Discard Pile`);
        } else {
            this.broadcastLog(`❌ Tidak ada kartu tersisa! Game berakhir.`);
            this.endGame(); return;
        }
        this.gs.currentProvince = card.province;
        this.gs.topCard = [card];
        this.gs.phase1Player = 'system';
        this.gs.currentRoundPlays.push({ playerId: 'system', playerName: 'Sistem', card, power: card.power });
        this.broadcastLog(`🎴 Sistem menjatuhkan ${card.name} (${card.province}) - Kekuatan ${card.power}`);
        this.broadcastGameState();
        setTimeout(() => this.startPhase2(), 1500);
    }

    botPlayPhase1(bot) {
        if (this.gs.isPaused) { setTimeout(() => this.botPlayPhase1(bot), 1000); return; }
        if (bot.hasPlayed || bot.hand.length === 0) return;
        const level = bot.botLevel ?? 1;
        let card;

        // Helper: cek apakah kartu termasuk legend/mythic
        const isHighRarity = (c) => c.rarity === 'legendary' || c.rarity === 'mythic';
        // Helper: cek apakah kartu termasuk epic ke atas
        const isEpicOrHigher = (c) => ['epic','rareplus','rarestar','rare','uncommon','uncommonplus','commonplus','common'].indexOf(c.rarity) === -1
            ? false : ['epic'].includes(c.rarity) || isHighRarity(c);

        if (level === 1) {
            card = [...bot.hand].sort((a, b) => b.power - a.power)[0];

        } else if (level === 2) {
            // ── Block win: jika ada lawan tinggal 1 kartu ──
            const topCard2 = this.gs.topCard[0];
            const nearWinOpp2 = topCard2
                ? this.gs.players.find(p => p.id !== bot.id && !p.winner && p.hand.length === 1)
                : null;
            const blockCard2 = nearWinOpp2 && topCard2
                ? [...bot.hand].filter(c => c.power > topCard2.power).sort((a, b) => a.power - b.power)[0]
                : null;

            // ── Hindari provinsi berbahaya (lawan tinggal 1 kartu) ──
            const oneCardOpps2 = this.gs.players.filter(p => p.id !== bot.id && !p.winner && p.hand.length === 1);
            const dangerProvinces2 = new Set(oneCardOpps2.flatMap(p => p.hand.map(c => c.province)));

            // ── Strategi Level 2: jatuhkan kartu power terkecil kedua (aman dari danger province) ──
            // Aturan:
            //   - Filter kartu yang aman (hindari provinsi berbahaya) jika memungkinkan
            //   - Jika kartu power terkecil hanya 1 buah → ambil kartu power terkecil KEDUA (power berbeda)
            //   - Jika kartu power terkecil ada lebih dari 1 buah → ambil salah satu dari yang terkecil itu
            const safeCards2 = dangerProvinces2.size > 0
                ? bot.hand.filter(c => !dangerProvinces2.has(c.province))
                : [...bot.hand];
            const sortedByPowerAsc2 = (safeCards2.length > 0 ? safeCards2 : [...bot.hand]).sort((a, b) => a.power - b.power);
            let secondWeakest2;
            if (sortedByPowerAsc2.length === 0) {
                secondWeakest2 = null;
            } else {
                const minPower2 = sortedByPowerAsc2[0].power;
                const minPowerCards2 = sortedByPowerAsc2.filter(c => c.power === minPower2);
                if (minPowerCards2.length > 1) {
                    secondWeakest2 = minPowerCards2[0];
                } else {
                    const nextCard2 = sortedByPowerAsc2.find(c => c.power > minPower2);
                    secondWeakest2 = nextCard2 ?? sortedByPowerAsc2[0];
                }
            }

            card = blockCard2 ?? secondWeakest2;

                } else {
            // ============================================================
            // LEVEL 3: Strategi (sama dengan lv2 + Force Draw + Solo Province)
            // Bot lv3 selalu mengecek kondisi setiap ronde/tahap.
            // ============================================================

            const opponents3 = this.gs.players.filter(p => p.id !== bot.id && !p.winner);

            // ── Pengecekan kondisi (dilakukan setiap saat) ──
            const allOppProvinces3 = new Set(opponents3.flatMap(p => p.hand.map(c => c.province)));
            const dpIsEmpty3       = this.gs.drawPile.length === 0;
            // Skip force draw jika: draw pile kosong ATAU (SEMUA lawan drawLevel > 5 DAN stok rare-common habis)
            const hasHighDrawOpp3  = opponents3.every(p => (p.drawLevel ?? 1) > 5);
            const lowRarities3     = new Set(['common','commonplus','uncommonplus','uncommon','rare','rarestar','rareplus']);
            const lowStockHabis3   = !this.gs.drawPile.some(c => lowRarities3.has(c.rarity));
            const skipForceDraw3   = dpIsEmpty3 || (hasHighDrawOpp3 && lowStockHabis3);

            // ── PRIORITAS 1: Block win (hanya aktif saat 1vs1 — lawan aktif tinggal 1 orang) ──
            const topCard3      = this.gs.topCard[0];
            const isOneVsOne3   = opponents3.length === 1;
            const nearWinOpp3   = (isOneVsOne3 && topCard3) ? opponents3.find(p => p.hand.length === 1) : null;
            const blockCard3    = nearWinOpp3 && topCard3
                ? [...bot.hand].filter(c => c.power > topCard3.power).sort((a, b) => a.power - b.power)[0]
                : null;

            // ── PRIORITAS 2: Force Draw (dicek setiap saat) ──
            // Utamakan kartu uncommon/common dari provinsi yang tidak dimiliki lawan.
            // Jika tidak ada uncommon/common unik, boleh pakai kartu lain HANYA JIKA
            // kartu terkecil bot memang bukan uncommon/common (misal terkecilnya epic).
            // Kartu yang dipakai harus tetap dari provinsi yang tidak dimiliki lawan.
            // Skip jika:
            //   - draw pile kosong, ATAU ada lawan drawLevel > 4 DAN stok rare-common habis
            //   - bot tinggal ≤ 2 kartu (endgame — jangan buang kartu sendiri)
            //   - bot punya kartu tertinggi di tangan lebih besar dari semua lawan (bot hampir menang ronde)
            const botHandCount3        = bot.hand.length;
            const maxOppHandPower3     = opponents3.flatMap(p => p.hand.map(c => c.power));
            const highestOppPower3     = maxOppHandPower3.length > 0 ? Math.max(...maxOppHandPower3) : 0;
            const botBestPower3        = Math.max(...bot.hand.map(c => c.power));
            const botCanWinRound3      = botBestPower3 > highestOppPower3;
            const skipForceDrawFinal3  = skipForceDraw3 || botHandCount3 <= 2 || botCanWinRound3;

            let forceDrawCard3 = null;
            if (!blockCard3 && !skipForceDrawFinal3) {
                const ucRarities3  = new Set(['common','commonplus','uncommonplus','uncommon']);
                // Kandidat: kartu yang provinsinya tidak dimiliki lawan (semua rarity)
                const uniqueCands3 = bot.hand.filter(c => !allOppProvinces3.has(c.province));

                // Cari kartu terkecil di seluruh tangan bot
                const botSorted3   = [...bot.hand].sort((a, b) => a.power - b.power);
                const botSmallest3 = botSorted3[0];

                // Utamakan uncommon/common dari provinsi unik
                const ucUnique3 = uniqueCands3.filter(c => ucRarities3.has(c.rarity));
                if (ucUnique3.length > 0) {
                    forceDrawCard3 = [...ucUnique3].sort((a, b) => a.power - b.power)[0];
                } else if (botSmallest3 && !ucRarities3.has(botSmallest3.rarity)) {
                    // Tidak ada uncommon/common unik, dan kartu terkecil bot bukan uncommon/common
                    // → boleh gunakan kartu terkecil dari provinsi unik (apapun raritynya)
                    if (uniqueCands3.length > 0) {
                        forceDrawCard3 = [...uniqueCands3].sort((a, b) => a.power - b.power)[0];
                    }
                }
            }

            // ── PRIORITAS 3: Solo Province (hanya saat draw pile habis) ──
            // Jika tidak ada lawan yang punya kartu dari provinsi yang sama dengan kartu bot,
            // jatuhkan kartu dari provinsi itu untuk memaksa lawan force pick dari top card.
            // SKIP jika:
            //   - draw pile TIDAK kosong (Solo Province hanya efektif saat draw pile habis)
            //   - bot tinggal ≤ 3 kartu (endgame — jangan buang kartu penting)
            // Pilih kartu dengan power TERKECIL (utamakan common/uncommon),
            // boleh jatuhkan Mythic sampai Rare★ HANYA jika kartu itu memang power terkecil yang dimiliki.
            let soloProvinceCard3 = null;
            if (!blockCard3 && dpIsEmpty3 && botHandCount3 > 3) {
                const botProvincesOwned3 = new Set(bot.hand.map(c => c.province));
                const soloProvinces3 = [...botProvincesOwned3].filter(prov => !allOppProvinces3.has(prov));
                if (soloProvinces3.length > 0) {
                    const soloCands3 = bot.hand.filter(c => soloProvinces3.includes(c.province));
                    const ucRaritiesSolo3 = new Set(['common','commonplus','uncommonplus','uncommon']);
                    // Utamakan common/uncommon dulu
                    const ucSolo3 = soloCands3.filter(c => ucRaritiesSolo3.has(c.rarity));
                    if (ucSolo3.length > 0) {
                        soloProvinceCard3 = [...ucSolo3].sort((a, b) => a.power - b.power)[0];
                    } else {
                        // Tidak ada common/uncommon → boleh pakai rarity lebih tinggi,
                        // ambil yang power terkecil (termasuk Mythic jika memang terkecil)
                        soloProvinceCard3 = [...soloCands3].sort((a, b) => a.power - b.power)[0];
                    }
                }
            }

            // ── PRIORITAS 4: Fallback sama dengan lv2 (terkecil-kedua aman) ──
            const oneCardOpps3     = opponents3.filter(p => p.hand.length === 1);
            const dangerProvinces3 = new Set(oneCardOpps3.flatMap(p => p.hand.map(c => c.province)));
            const safeCards3       = dangerProvinces3.size > 0
                ? bot.hand.filter(c => !dangerProvinces3.has(c.province))
                : [...bot.hand];
            const sortedAsc3 = (safeCards3.length > 0 ? safeCards3 : [...bot.hand]).sort((a, b) => a.power - b.power);
            let secondWeakest3 = null;
            if (sortedAsc3.length > 0) {
                const minP3 = sortedAsc3[0].power;
                const ties3 = sortedAsc3.filter(c => c.power === minP3);
                if (ties3.length > 1) {
                    secondWeakest3 = ties3[0];
                } else {
                    secondWeakest3 = sortedAsc3.find(c => c.power > minP3) ?? sortedAsc3[0];
                }
            }

            // ── Prioritas final ──
            const _usedBlock3      = !!blockCard3;
            const _usedForceDraw3  = !_usedBlock3 && !!forceDrawCard3;
            const _usedSoloProv3   = !_usedBlock3 && !_usedForceDraw3 && !!soloProvinceCard3;

            card = _usedBlock3     ? blockCard3
                 : _usedForceDraw3 ? forceDrawCard3
                 : _usedSoloProv3  ? soloProvinceCard3
                 : (secondWeakest3 ?? [...bot.hand].sort((a, b) => a.power - b.power)[0]);

            bot._lv3flags = { usedBlock: _usedBlock3, usedForceDraw: _usedForceDraw3, usedSoloProv: _usedSoloProv3 };
        }
        this.gs.currentProvince = card.province;
        this.gs.topCard = [card];
        bot.hand.splice(bot.hand.findIndex(c => c.id === card.id), 1);
        bot.hasPlayed = true;
        this.updatePower(bot);
        this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card, power: card.power });
        // Log strategi yang dipakai berdasarkan level
        const lv = bot.botLevel ?? 1;
        let strategyNote = '';
        if (lv === 2) strategyNote = ' [Lv2: terkecil-kedua aman]';
        else if (lv === 3) {
            const flags   = bot._lv3flags ?? {};
            bot._lv3flags = undefined;
            if (flags.usedBlock)          strategyNote = ' [Lv3: block-win]';
            else if (flags.usedForceDraw) strategyNote = ' [Lv3: force-draw-unik]';
            else if (flags.usedSoloProv)  strategyNote = ' [Lv3: solo-provinsi(dpHabis)]';
            else                          strategyNote = ' [Lv3: terkecil-kedua]';
        }
        this.broadcastLog(`👤 ${bot.name} menjatuhkan ${card.name} (${card.province}) - Kekuatan ${card.power}${strategyNote}`);
        this.checkWin(bot);
        this.broadcastGameState();
        setTimeout(() => this.startPhase2(), 1000);
    }

    // Cek apakah masih ada kartu provinsi aktif di draw pile
    hasMatchingInDrawPile() {
        return this.gs.drawPile.some(c => c.province === this.gs.currentProvince);
    }

    startPhase2() {
        if (this.gs.isPaused) { setTimeout(() => this.startPhase2(), 1000); return; }
        if (this.gs.gameOver) return;
        this.gs.phase = 2;
        this.gs.forcePickProcessing = false;
        this.gs.isHandlingForcePick = false;
        this.broadcastLog(`📍 Tahap 2 dimulai! Provinsi aktif: ${this.gs.currentProvince}`);
        const drawPileEmpty = this.gs.drawPile.length === 0;
        // ── RESIKO: Cek apakah kartu satu provinsi dengan top card sudah habis ──
        const matchingInDraw = this.hasMatchingInDrawPile();
        const matchingInHands = this.gs.players.some(p =>
            p.hand.some(c => c.province === this.gs.currentProvince)
        );
        if (!drawPileEmpty && !matchingInDraw && !matchingInHands) {
            // Semua kartu provinsi ini sudah habis dari draw pile DAN tangan semua pemain
            // Ini tidak mungkin terjadi di sini karena topCard masih ada, skip warning ini
        }
        // Aturan baru: jika drawPile tidak punya kartu satu provinsi dengan top card,
        // pemain yang mustDraw hanya perlu 1x draw dan tidak perlu jatuhkan kartu (ronde bisa berganti).
        const noMatchingAnywhere = !matchingInDraw && !drawPileEmpty;
        if (noMatchingAnywhere) {
            this.broadcastLog(`🚫 Kartu dari provinsi ${this.gs.currentProvince} pada kartu tersisa telah habis! Pemain cukup 1x draw saja.`);
        }

        this.getActivePlayers().forEach(player => {
            if (player.hasPlayed) return;
            const hasMatching = player.hand.some(c => c.province === this.gs.currentProvince);
            if (!hasMatching) {
                if (drawPileEmpty) { player.mustForcePick = true; }
                else {
                    player.mustDraw = true;
                    // Flag khusus: jika provinsi habis di drawPile, draw 1x lalu selesai (tidak perlu jatuhkan)
                    player.drawOnceNoMatch = noMatchingAnywhere;
                    if (!player.isBot) {
                        if (player.autoMode) {
                            // Sudah autoMode (disconnect/AFK sejak awal) → langsung jalankan aksi otomatis
                            setTimeout(() => this.runAutoAction(player), 500);
                        } else {
                            this.setAfkTimer(player, () => {
                                if (player.mustDraw && !player.hasPlayed) this.setPlayerAutoMode(player.id, true, 'AFK');
                            });
                        }
                    }
                }
            } else if (!player.isBot) {
                if (player.autoMode) {
                    // Sudah autoMode → langsung jalankan aksi otomatis
                    setTimeout(() => this.runAutoAction(player), 500);
                } else {
                    this.setAfkTimer(player, () => {
                        if (!player.hasPlayed && !player.mustDraw && !player.mustForcePick)
                            this.setPlayerAutoMode(player.id, true, 'AFK');
                    });
                }
            }
        });
        // ── Pisahkan pemain: yang mustDraw masuk antrian round-robin, yang punya kartu cocok langsung main ──
        // Hanya BOT yang masuk startSimultaneousDraw — human mustDraw menunggu aksi DRAW_CARD dari client
        // (termasuk human drawOnceNoMatch). Jika human dimasukkan ke sini, botDelay timer akan memanggil
        // checkPhase2End() dua kali: sekali dari handleDrawCardInternal dan sekali dari botDelay → double trigger.
        const mustDrawPlayers = this.getActivePlayers().filter(p => !p.hasPlayed && p.mustDraw);
        const mustDrawBots    = mustDrawPlayers.filter(p => p.isBot);
        const canPlayPlayers  = this.getActivePlayers().filter(p => !p.hasPlayed && !p.mustDraw && !p.mustForcePick);

        // Bot yang punya kartu cocok langsung mainkan dulu
        canPlayPlayers.filter(p => p.isBot).forEach((bot, idx) => {
            setTimeout(() => { if (!bot.hasPlayed) this.botPlayMatchingCard(bot); }, (idx + 1) * 600);
        });

        this.broadcastGameState();
        // [FIX] Pemain autoMode yang mustForcePick (drawPile habis) belum ditangani di loop atas → tangani di sini
        // Pemain autoMode lainnya (mustDraw / hasMatching) sudah dipanggil runAutoAction di loop forEach atas
        this.getActivePlayers().filter(p => !p.isBot && p.autoMode && !p.hasPlayed && p.mustForcePick)
            .forEach(p => setTimeout(() => this.runAutoAction(p), 500));

        if (mustDrawBots.length === 0) {
            const _phase2Round = this.gs.round;
            setTimeout(() => { if (!this.gs.gameOver && this.gs.round === _phase2Round) this.checkPhase2End(); }, canPlayPlayers.filter(p => p.isBot).length * 600 + 800);
            return;
        }

        // ── Hanya bot yang mustDraw melakukan draw secara bersamaan ──
        const _phase2Round2 = this.gs.round;
        setTimeout(() => { if (!this.gs.gameOver && this.gs.round === _phase2Round2) this.startSimultaneousDraw(mustDrawBots); }, 1000);
    }

    // Bot yang punya kartu cocok langsung jatuhkan kartu terbaik
    botPlayMatchingCard(bot) {
        if (bot.hasPlayed || bot.mustDraw) return;
        const matching = bot.hand.filter(c => c.province === this.gs.currentProvince);
        if (matching.length === 0) return;
        const level = bot.botLevel ?? 1;
        // Block win untuk level 2 dan 3: jika lawan tinggal 1 kartu di tangan dan sudah jatuhkan kartu
        // Lv3: hanya aktif saat 1vs1 (lawan aktif tinggal 1 orang)
        const topCardNow = this.gs.topCard[this.gs.topCard.length - 1];
        const activeOppsP2 = this.gs.players.filter(p => p.id !== bot.id && !p.winner);
        const isOneVsOneP2 = activeOppsP2.length === 1;
        const nearWinOppP2 = (level >= 2 && topCardNow && (level < 3 || isOneVsOneP2))
            ? this.gs.players.find(p => p.id !== bot.id && !p.winner && p.hand.length === 1)
            : null;
        let sorted;
        if (nearWinOppP2 && topCardNow) {
            const blockables = [...matching].filter(c => c.power > topCardNow.power).sort((a, b) => a.power - b.power);
            sorted = blockables.length > 0 ? blockables : [...matching].sort((a, b) => a.power - b.power);
                } else if (level >= 3) {
            // Lv3 Phase 2: jatuhkan kartu matching dengan power terkecil
            sorted = [...matching].sort((a, b) => a.power - b.power);
        } else {
            sorted = level === 1
                ? [...matching].sort((a, b) => b.power - a.power)
                : [...matching].sort((a, b) => a.power - b.power);
        }
        const playable = sorted.filter(c => !this.gs.topCard.some(t => t.id === c.id));
        if (playable.length === 0) {
            if (this.gs.drawPile.length === 0) { bot.mustForcePick = true; }
            else if (this.dealCard(bot)) {
                bot.mustDraw = false; bot.hasPlayed = true;
                this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: null, power: 0 });
            }
            this.broadcastGameState(); return;
        }
        const card = playable[0];
        bot.hand.splice(bot.hand.findIndex(c => c.id === card.id), 1);
        this.gs.topCard.push(card); bot.hasPlayed = true;
        this.updatePower(bot);
        this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card, power: card.power });
        this.broadcastLog(`👤 ${bot.name} menjatuhkan ${card.name} - Kekuatan ${card.power}`);
        this.checkWin(bot);
        this.broadcastGameState();
    }

    // ── Draw Bersamaan: hanya BOT yang mustDraw melakukan draw secara simultan ──
    // Human mustDraw tidak masuk sini — mereka menunggu aksi DRAW_CARD dari client
    // agar tidak terjadi double checkPhase2End() antara handleDrawCardInternal dan botDelay.
    startSimultaneousDraw(mustDrawBots) {
        if (this.gs.gameOver) return;
        if (mustDrawBots.length === 0) return;
        this.broadcastLog(`🎴 Bot draw serentak! (${mustDrawBots.map(p => p.name).join(', ')})`);

        mustDrawBots.forEach((bot, idx) => {
            setTimeout(() => {
                if (bot.hasPlayed || bot.winner || this.gs.gameOver) return;
                this.botDrawSimultaneous(bot);
            }, (idx + 1) * 600);
        });

        this.broadcastGameState();

        // Jadwalkan checkPhase2End setelah semua bot selesai draw
        const botDelay = (mustDrawBots.length + 1) * 600 + 800;
        setTimeout(() => {
            if (!this.gs.gameOver) this.checkPhase2End();
        }, botDelay);
    }

    // Bot melakukan draw dalam mode simultan (terus draw sampai dapat kartu cocok atau pile habis)
    botDrawSimultaneous(bot) {
        if (bot.hasPlayed || bot.winner || this.gs.gameOver) return;
        const drewOk = this.dealCard(bot);
        if (!drewOk) {
            this.broadcastLog(`⚠️ ${bot.name} gagal Draw - Draw Pile habis → Force Pick`);
            this.broadcastGameState(); return;
        }
        const newCard = bot.hand[bot.hand.length - 1];
        const isMatch = newCard && newCard.province === this.gs.currentProvince;

        // ── ATURAN: Jika drawOnceNoMatch aktif → 1x draw selesai, tidak peduli cocok atau tidak ──
        if (bot.drawOnceNoMatch) {
            bot.mustDraw = false;
            bot.drawOnceNoMatch = false;
            bot.hasPlayed = true;
            this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: null, power: 0, isDraw: true });
            this.broadcastLog(`🔄 ${bot.name} draw 1x: ${newCard?.name} — provinsi ${this.gs.currentProvince} habis di kartu tersisa, selesai.`);
            this.broadcastGameState();
            setTimeout(() => { if (!this.gs.gameOver) this.checkPhase2End(); }, 400);
            return;
        }

        if (isMatch) {
            bot.mustDraw = false; bot.mustPlayMatching = true;
            this.broadcastLog(`✅ ${bot.name} dapat kartu cocok: ${newCard.name} — langsung dijatuhkan!`);
            setTimeout(() => {
                if (!bot.hasPlayed) this.handlePlayCardInternal(bot, newCard);
            }, 800);
        } else {
            // Cek apakah provinsi baru saja habis setelah draw ini
            const matchingStillInPile = this.hasMatchingInDrawPile();
            if (!matchingStillInPile && this.gs.drawPile.length > 0) {
                this.broadcastLog(`🚫 Kartu dari provinsi ${this.gs.currentProvince} pada kartu tersisa telah habis! ${bot.name} selesai draw.`);
                bot.mustDraw = false;
                bot.hasPlayed = true;
                this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: null, power: 0, isDraw: true });
                this.broadcastGameState();
                setTimeout(() => { if (!this.gs.gameOver) this.checkPhase2End(); }, 400);
                return;
            }
            this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: null, power: 0, isDraw: true });
            this.broadcastLog(`🔄 ${bot.name} draw: ${newCard.name} (${newCard.rarity}) — belum cocok, draw lagi...`);
            this.broadcastGameState();
            // Bot terus draw sampai dapat kartu cocok atau pile habis
            setTimeout(() => this.botDrawSimultaneous(bot), 700);
        }
    }

    checkPhase2End() {
        if (this.gs.gameOver || this.gs.isHandlingForcePick || this.gs.isEndingRound) return;
        const activePlayers = this.getActivePlayers();
        // Cek SEMUA human aktif (bukan hanya yang pertama) — fix bug multi-player stuck
        const activeHumans = activePlayers.filter(p => !p.isBot);
        for (const human of activeHumans) {
            // Blokir jika ada human yang masih dalam proses draw atau wajib jatuhkan kartu cocok
            if (human.mustDraw || human.mustPlayMatching) return;
            // Blokir jika human belum main DAN tidak dalam kondisi force pick DAN tidak auto mode
            if (!human.hasPlayed && !human.mustForcePick && !human.autoMode) return;
        }
        // Pemain yang masih mustDraw atau mustPlayMatching belum selesai
        const stillDrawing = activePlayers.filter(p => p.mustDraw || p.mustPlayMatching);
        if (stillDrawing.length > 0) return;
        if (!activePlayers.every(p => p.hasPlayed || p.mustForcePick)) return;
        const fpPlayers = activePlayers.filter(p => p.mustForcePick && !p.hasPlayed);
        if (fpPlayers.length === 0) { this.endRound(); return; }
        if (this.gs.isHandlingForcePick) return;
        this.gs.isHandlingForcePick = true;
        setTimeout(() => this.handleForcePickDecision(fpPlayers), 500);
    }

    handleForcePickDecision(fpPlayers) {
        const totalJatuhkan = this.gs.currentRoundPlays.filter(p => p.card?.province === this.gs.currentProvince).length;
        const totalFP = fpPlayers.length;

        // ── Urutkan pemain draw secara bergantian (giliran) ──
        // Urutan: kartu paling sedikit = giliran pertama, terbanyak = terakhir
        // Tie-breaker 1: total power paling kecil = lebih dulu
        // Tie-breaker 2: kartu power terbesar di ronde sebelumnya = paling belakang
        const lastRound = this.gs.roundHistory.length > 0 ? this.gs.roundHistory[this.gs.roundHistory.length - 1] : null;
        const sorted = [...fpPlayers].sort((a, b) => {
            if (a.hand.length !== b.hand.length) return a.hand.length - b.hand.length; // kartu sedikit = depan (draw), banyak = belakang (bebas)
            if (a.totalPower !== b.totalPower) return a.totalPower - b.totalPower; // power kecil = belakang (bebas)
            // Tie-breaker 3: power terbesar di ronde sebelumnya = paling belakang (bebas)
            const getPrevPower = (p) => {
                if (!lastRound) return 0;
                const play = lastRound.plays.find(pl => pl.playerId === p.id && !pl.isForcePickPlay);
                return play ? play.power : 0;
            };
            return getPrevPower(b) - getPrevPower(a); // power besar di ronde lalu = lebih belakang (bebas)
        });

        // ── Tentukan siapa yang dibebaskan ──
        if (totalJatuhkan >= totalFP) {
            this.broadcastLog(`⚠️ Tidak ada pembebasan - semua harus draw bergiliran`);
            this.gs.drawTurnQueue = sorted;
        } else {
            const jumlahBebas = totalFP - totalJatuhkan;
            // Yang dibebaskan: yang paling banyak kartu (sorted terbalik = index terakhir)
            const bebasPlayers = sorted.slice(sorted.length - jumlahBebas);
            const drawPlayers  = sorted.slice(0, sorted.length - jumlahBebas);
            for (const p of bebasPlayers) {
                p.mustForcePick = false; p.hasPlayed = true; p.freed = true;
                this.broadcastLog(`✅ 👤 ${p.name} DIBEBASKAN dari Force Pick! (kartu terbanyak)`);
            }
            this.gs.drawTurnQueue = drawPlayers;
        }

        if (this.gs.drawTurnQueue.length === 0) {
            this.processForcePick([], []);
            return;
        }

        this.gs.drawTurnIndex = 0;
        this.gs.isProcessingDrawTurn = true;
        this.broadcastLog(`🔄 Sistem Draw Bergantian dimulai! Urutan: ${this.gs.drawTurnQueue.map(p => p.name).join(' → ')}`);
        this.processForcePick(this.gs.drawTurnQueue, []);
    }

    processForcePick(mustPickPlayers, freedPlayers) {
        const humanMustPick = mustPickPlayers.find(p => !p.isBot);
        const botMustPick   = mustPickPlayers.filter(p => p.isBot);

        // Aktifkan forcePickMode untuk human (jika ada)
        if (humanMustPick) {
            this.gs.forcePickMode = true;
            this.gs.forcePickPlayers = mustPickPlayers;
            this.gs.forcePickProcessing = false;
            this.broadcastLog(`⚠️ ${humanMustPick.name} harus memilih kartu dari Top Card!`);
            this.broadcastGameState();
            this.setAfkTimer(humanMustPick, () => {
                if (!humanMustPick.hasPlayed) this.setPlayerAutoMode(humanMustPick.id, true, 'AFK');
            });
        }

        // Bot ambil kartu BERSAMAAN dengan player, delay acak 2-6 detik biar natural (tidak ketahuan bot)
        botMustPick.forEach((bot, idx) => {
            const randomDelay = 1500 + Math.floor(Math.random() * 1500) + idx * 500;
            setTimeout(() => {
                if (bot.hasPlayed || bot.winner || this.gs.gameOver) return;
                if (this.gs.topCard.length === 0) return;
                const level = bot.botLevel ?? 1;
                let chosen;
                if (level === 1) {
                    chosen = [...this.gs.topCard].sort((a,b) => a.power - b.power)[0];
                } else if (level === 2) {
                    chosen = [...this.gs.topCard].sort((a,b) => b.power - a.power)[0];
                } else {
                    // Lv3: pilih kartu yang provinsinya tidak dimiliki lawan
                    const activeOpponents = this.gs.players.filter(p => p.id !== bot.id && !p.winner);
                    const allOppProvFP    = new Set(activeOpponents.flatMap(p => p.hand.map(c => c.province)));
                    const uniqueFP        = this.gs.topCard.filter(c => !allOppProvFP.has(c.province));
                    const rarityOrderFP   = ['mythic','legendary','epic','rareplus','rarestar','rare','uncommonplus','uncommon','commonplus','common'];
                    const sortByRarityPowerFP = (arr) => [...arr].sort((a, b) => {
                        const ri = rarityOrderFP.indexOf(a.rarity) - rarityOrderFP.indexOf(b.rarity);
                        return ri !== 0 ? ri : b.power - a.power;
                    });
                    chosen = uniqueFP.length > 0 ? sortByRarityPowerFP(uniqueFP)[0] : sortByRarityPowerFP(this.gs.topCard)[0];
                }
                this.gs.topCard.splice(this.gs.topCard.findIndex(c => c.id === chosen.id), 1);
                bot.hand.push(chosen); bot.mustForcePick = false; bot.hasPlayed = true;
                this.updatePower(bot);
                this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: chosen, power: chosen.power, isForcePickPlay: true });
                this.broadcastLog(`?? ${bot.name} Mengambil kartu: ${chosen.name} (Kekuatan: ${chosen.power})`);
                this.broadcastGameState();
                // Jika tidak ada human, cek apakah semua bot sudah selesai lalu endRound
                if (!humanMustPick) {
                    const stillPicking = botMustPick.filter(p => !p.hasPlayed);
                    if (stillPicking.length === 0) {
                        this.gs.forcePickMode = false;
                        setTimeout(() => { this.gs.isHandlingForcePick = false; if (!this.gs.isEndingRound) this.endRound(); }, 500);
                    }
                }
            }, randomDelay);
        });

        // Tidak ada human dan tidak ada bot, langsung endRound
        if (!humanMustPick && botMustPick.length === 0) {
            this.gs.forcePickMode = false;
            this.broadcastGameState();
            setTimeout(() => { this.gs.isHandlingForcePick = false; if (!this.gs.isEndingRound) this.endRound(); }, 500);
        }
    }

    handlePlayCardInternal(player, card) {
        this.clearAfkTimer(player);
        if (this.gs.phase === 1) {
            player.hand.splice(player.hand.findIndex(c => c.id === card.id), 1);
            player.hasPlayed = true;
            this.gs.currentProvince = card.province; this.gs.topCard = [card];
            this.updatePower(player);
            this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card, power: card.power });
            this.broadcastLog(`👤 ${player.name} menjatuhkan ${card.name} (${card.province}) - Kekuatan ${card.power}`);
            this.checkWin(player); this.broadcastGameState();
            setTimeout(() => this.startPhase2(), 800);
        } else {
            player.hand.splice(player.hand.findIndex(c => c.id === card.id), 1);
            this.gs.topCard.push(card); player.hasPlayed = true;
            player.mustPlayMatching = false;
            this.updatePower(player);
            this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card, power: card.power });
            this.broadcastLog(`👤 ${player.name} menjatuhkan ${card.name} - Kekuatan ${card.power}`);
            this.checkWin(player); this.broadcastGameState();
            setTimeout(() => this.checkPhase2End(), 500);
        }
    }

    handleDrawCardInternal(player) {
        this.clearAfkTimer(player);
        const drewOk = this.dealCard(player);
        if (drewOk) {
            // Cek apakah kartu yang baru didapat cocok dengan provinsi aktif
            const newCard = player.hand[player.hand.length - 1];
            const isMatch = newCard && newCard.province === this.gs.currentProvince;

            // ── ATURAN: Jika provinsi top card sudah habis di drawPile (drawOnceNoMatch),
            //    cukup 1x draw saja dan ronde bisa berganti — tidak peduli cocok atau tidak.
            if (player.drawOnceNoMatch) {
                player.mustDraw = false;
                player.drawOnceNoMatch = false;
                player.hasPlayed = true;
                this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card: null, power: 0, isDraw: true });
                this.broadcastLog(`🔄 ${player.name} draw 1x: ${newCard?.name} (${newCard?.rarity}) — provinsi ${this.gs.currentProvince} habis di kartu tersisa, ronde berlanjut.`);
                this.broadcastGameState();
                setTimeout(() => this.checkPhase2End(), 500);
                return;
            }

            if (isMatch) {
                // Dapat kartu cocok → wajib jatuhkan kartu itu
                player.mustDraw = false;
                player.mustPlayMatching = true;
                this.broadcastLog(`✅ ${player.name} mendapat kartu cocok: ${newCard.name} (${this.gs.currentProvince}) — harus dijatuhkan!`);
                this.broadcastGameState();
                if (!player.isBot && !player.autoMode) {
                    // Human manual: tunggu aksi PLAY_CARD dari client
                    this.setAfkTimer(player, () => {
                        if (player.mustPlayMatching && !player.hasPlayed) this.setPlayerAutoMode(player.id, true, 'AFK');
                    });
                } else {
                    // Bot atau human auto mode: langsung jatuhkan
                    setTimeout(() => {
                        if (player.mustPlayMatching && !player.hasPlayed) {
                            this.handlePlayCardInternal(player, newCard);
                        }
                    }, 800);
                }
            } else {
                // ── Kartu tidak cocok → cek apakah provinsi aktif sudah habis di pile ──
                const matchingStillInPile = this.hasMatchingInDrawPile();
                if (!matchingStillInPile && this.gs.drawPile.length > 0) {
                    // Provinsi baru saja habis di pile saat draw ini
                    this.broadcastLog(`🚫 Kartu dari provinsi ${this.gs.currentProvince} pada kartu tersisa telah habis! ${player.name} selesai draw.`);
                    player.mustDraw = false;
                    player.drawOnceNoMatch = false;
                    player.hasPlayed = true;
                    this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card: null, power: 0, isDraw: true });
                    this.broadcastGameState();
                    setTimeout(() => this.checkPhase2End(), 500);
                    return;
                }
                // Tetap mustDraw, tunggu aksi draw lagi dari client (draw bersamaan)
                player.mustDraw = true;
                player.hasPlayed = false;
                this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card: null, power: 0, isDraw: true });
                this.broadcastLog(`🔄 ${player.name} draw: ${newCard?.name} (${newCard?.rarity}) — belum cocok.`);
                this.broadcastGameState();
                if (!player.isBot && !player.autoMode) {
                    // Human manual: pasang AFK timer, tunggu aksi dari client
                    this.setAfkTimer(player, () => {
                        if (player.mustDraw && !player.hasPlayed) this.setPlayerAutoMode(player.id, true, 'AFK');
                    });
                } else {
                    // Bot atau human auto mode: langsung lanjut draw tanpa tunggu
                    setTimeout(() => {
                        if (player.mustDraw && !player.hasPlayed) this.handleDrawCardInternal(player);
                    }, 800);
                }
            }
        } else {
            // dealCard gagal → sudah di-set mustForcePick oleh dealCard
            this.broadcastLog(`⚠️ ${player.name} gagal Draw - Draw Pile habis → Force Pick`);
            this.broadcastGameState();
            setTimeout(() => this.checkPhase2End(), 500);
        }
    }

    handleForcePickCardInternal(player, cardId) {
        this.clearAfkTimer(player);
        const card = this.gs.topCard.find(c => c.id === cardId);
        if (!card) return;
        this.gs.topCard.splice(this.gs.topCard.findIndex(c => c.id === cardId), 1);
        player.hand.push(card);
        player.mustForcePick = false;
        player.hasPlayed = true;
        this.updatePower(player);
        this.gs.currentRoundPlays.push({ playerId: player.id, playerName: player.name, card, power: card.power, isForcePickPlay: true });
        this.broadcastLog(`👤 ${player.name} Mengambil kartu: ${card.name} (Kekuatan: ${card.power})`);
        this.gs.forcePickPlayers.filter(p => p.isBot && !p.hasPlayed).forEach(bot => {
            if (this.gs.topCard.length > 0) {
                const level = bot.botLevel ?? 1;
                let chosen;
                if (level === 1) {
                    chosen = [...this.gs.topCard].sort((a,b) => a.power - b.power)[0];
                } else if (level === 2) {
                    chosen = [...this.gs.topCard].sort((a,b) => b.power - a.power)[0];
                } else {
                    // Lv3: pilih kartu dari top card yang provinsinya tidak dimiliki lawan
                    // supaya lawan kena draw di ronde berikutnya (force draw)
                    // Dari kandidat unik → ambil power TERTINGGI (Mythic/Legendary/Epic diprioritaskan)
                    // Jika semua provinsi dimiliki lawan, ambil power TERTINGGI dari semua topCard
                    const activeOpps2   = this.gs.players.filter(p => p.id !== bot.id && !p.winner);
                    const allOppProvFP2 = new Set(activeOpps2.flatMap(p => p.hand.map(c => c.province)));
                    const uniqueFP2     = this.gs.topCard.filter(c => !allOppProvFP2.has(c.province));
                    if (uniqueFP2.length > 0) {
                        chosen = [...uniqueFP2].sort((a, b) => b.power - a.power)[0];
                    } else {
                        chosen = [...this.gs.topCard].sort((a, b) => b.power - a.power)[0];
                    }
                }
                this.gs.topCard.splice(this.gs.topCard.findIndex(c => c.id === chosen.id), 1);
                bot.hand.push(chosen); bot.mustForcePick = false; bot.hasPlayed = true;
                this.updatePower(bot);
                this.gs.currentRoundPlays.push({ playerId: bot.id, playerName: bot.name, card: chosen, power: chosen.power, isForcePickPlay: true });
                this.broadcastLog(`👤 ${bot.name} Mengambil kartu: ${chosen.name} (Kekuatan: ${chosen.power})`);
            }
        });
        this.gs.forcePickMode = false;
        this.broadcastGameState();
        setTimeout(() => { this.gs.isHandlingForcePick = false; if (!this.gs.isEndingRound) this.endRound(); }, 500);
    }

    handlePlayerAction(playerId, action) {
        const player = this.gs.players.find(p => p.id === playerId);
        if (!player || player.winner || this.gs.gameOver) return;
        if (player.autoMode) {
            player.autoMode = false;
            if (player.autoModeTimerId) { clearTimeout(player.autoModeTimerId); player.autoModeTimerId = undefined; }
            player.disconnectedAt = undefined;
            this.broadcastLog(`✅ ${player.name} kembali aktif`);
            this.broadcastGameState();
        }
        if (action.type === 'PLAY_CARD') {
            if (player.hasPlayed || player.isProcessingAction) return;
            const card = player.hand.find(c => c.id === action.cardId);
            if (!card) { this.sendToPlayer(playerId, { type:'ERROR', message:'Kartu tidak ditemukan!' }); return; }
            if (this.gs.phase === 1 && this.gs.phase1Player !== playerId) { this.sendToPlayer(playerId, { type:'ERROR', message:'Bukan giliran Anda di Tahap 1!' }); return; }
            if (this.gs.phase === 2) {
                // Jika mustDraw tapi kartu yang diklik cocok dengan provinsi aktif
                // dan kartu ini sudah ada di tangan sejak awal (bukan dari draw) → izinkan main
                if (player.mustDraw) {
                    const isMatchingCard = card.province === this.gs.currentProvince;
                    if (isMatchingCard) {
                        // Pemain punya kartu cocok di tangan → tidak perlu draw, langsung main
                        player.mustDraw = false;
                        player.drawOnceNoMatch = false;
                        this.broadcastLog(`✅ ${player.name} punya kartu cocok di tangan — langsung jatuhkan tanpa draw.`);
                    } else {
                        this.sendToPlayer(playerId, { type:'ERROR', message:'Anda harus Draw Card terlebih dahulu!' });
                        return;
                    }
                }
                if (player.mustPlayMatching) {
                    // Harus jatuhkan kartu yang cocok dengan provinsi aktif
                    if (card.province !== this.gs.currentProvince) {
                        this.sendToPlayer(playerId, { type:'ERROR', message:`Anda harus menjatuhkan kartu dari provinsi ${this.gs.currentProvince}!` }); return;
                    }
                } else {
                    if (card.province !== this.gs.currentProvince) { this.sendToPlayer(playerId, { type:'ERROR', message:`Kartu bukan dari provinsi ${this.gs.currentProvince}!` }); return; }
                }
                if (this.gs.topCard.some(c => c.id === card.id)) { this.sendToPlayer(playerId, { type:'ERROR', message:'Kartu duplikat!' }); return; }
            }
            this.handlePlayCardInternal(player, card);
        } else if (action.type === 'DRAW_CARD') {
            if (!player.mustDraw || player.hasPlayed) return;
            this.handleDrawCardInternal(player);
        } else if (action.type === 'FORCE_PICK_CARD') {
            if (!this.gs.forcePickMode) return;
            if (!this.gs.forcePickPlayers.some(p => p.id === playerId)) return;
            if (player.hasPlayed) return;
            if (!this.gs.topCard.find(c => c.id === action.cardId)) { this.sendToPlayer(playerId, { type:'ERROR', message:'Kartu tidak ada di Top Card!' }); return; }
            this.handleForcePickCardInternal(player, action.cardId);
        }
    }

    handleSurrender(playerId) {
        const player = this.gs.players.find(p => p.id === playerId);
        if (!player || player.winner || player.isBot || this.gs.gameOver) return;
        const totalPlayers = this.gs.players.length;
        const takenRanks = new Set(this.gs.winners.map(w => w.rank));
        let worstRank = totalPlayers;
        while (worstRank > 0 && takenRanks.has(worstRank)) worstRank--;
        player.rank = worstRank > 0 ? worstRank : totalPlayers;
        player.winner = true;
        this.gs.winners.push(player);
        if (player.userUid && player.userUid !== "BOT" && !this.isCustomRoom) {
            player.statsSaved = true;
            const _p = player;
            savePlayerStats(_p.userUid, _p.name, _p.rank).then(ok => {
                if (ok) {
                    // Kirim STATS_SAVED agar client bisa tambah EXP sesuai posisi
                    if (_p.socket && _p.socket.readyState === WebSocket.OPEN) {
                        try { _p.socket.send(JSON.stringify({ type: 'STATS_SAVED', rank: _p.rank })); } catch (_) {}
                    }
                } else {
                    _p.statsSaved = false;
                    if (_p.socket && _p.socket.readyState === WebSocket.OPEN) {
                        try { _p.socket.send(JSON.stringify({ type: 'SAVE_STATS_CLIENT', rank: _p.rank })); } catch (_) {}
                    }
                }
            }).catch(e => { player.statsSaved = false; });
        }
        this.gs.discardPile.push(...player.hand);
        this.broadcastLog(`🏳️ ${player.name} menyerah! (Peringkat ${player.rank})`);
        player.hand = []; player.totalPower = 0; player.hasPlayed = true;
        this.broadcastGameState();
        const remaining = this.getActivePlayers();
        if (remaining.length <= 1) {
            if (remaining.length === 1) {
                const lastOne = remaining[0];
                const allRanks = Array.from({length: totalPlayers}, (_, i) => i + 1);
                const takenRanksAfterSurrender = this.gs.winners.map(w => w.rank);
                lastOne.rank = allRanks.find(r => !takenRanksAfterSurrender.includes(r)) || 0;
                lastOne.winner = true;
                this.gs.winners.push(lastOne);
                this.broadcastLog(`🏆 ${lastOne.name} menang sebagai Peringkat ${lastOne.rank}!`);
            }
            setTimeout(() => this.endGame(), 1000);
        } else {
            if (this.gs.phase === 2 && !this.gs.isHandlingForcePick && !this.gs.isEndingRound) {
                setTimeout(() => this.checkPhase2End(), 500);
            } else if (this.gs.phase === 1 && this.gs.phase1Player === playerId) {
                this.gs.phase1Player = null;
                setTimeout(() => this.systemPlayPhase1(), 500);
            }
        }
    }

    endRound() {
        if (this.gs.isEndingRound) return;
        this.gs.isEndingRound = true;
        this.clearAllAfkTimers();
        this.gs.roundHistory.push({ round: this.gs.round, plays: [...this.gs.currentRoundPlays] });
        this.broadcastLog(`🏁 Ronde ${this.gs.round} selesai`);
        setTimeout(() => {
            this.gs.discardPile.push(...this.gs.topCard);
            this.gs.topCard = []; this.gs.currentProvince = null;
            this.gs.forcePickMode = false; this.gs.forcePickPlayers = [];
            this.broadcastGameState();
            const activePlayers = this.getActivePlayers();
            if (activePlayers.length === 0) { setTimeout(() => { this.gs.isEndingRound = false; this.endGame(); }, 1000); return; }
            if (activePlayers.length === 1) {
                const loser = activePlayers[0];
                // [FIX v15] Jika pemain terakhir sedang disconnect (autoMode), beri grace period 10 detik
                // agar dia sempat reconnect sebelum game berakhir. Jika reconnect → game lanjut normal.
                if (!loser.isBot && loser.autoMode && !loser.leftMatch) {
                    this.broadcastLog(`⏳ ${loser.name} terputus — menunggu reconnect (10 detik)...`);
                    const _capturedEngine = this;
                    const _capturedLoser  = loser;
                    const _graceTimer = setTimeout(() => {
                        // Cek lagi — mungkin sudah reconnect
                        if (_capturedEngine.gs.gameOver) return;
                        if (!_capturedLoser.autoMode) {
                            // Sudah reconnect — lanjutkan game normal
                            _capturedEngine.gs.isEndingRound = false;
                            _capturedEngine.gs.round++;
                            _capturedEngine.broadcastLog(`🎮 === RONDE ${_capturedEngine.gs.round} DIMULAI ===`);
                            setTimeout(() => {
                                _capturedEngine.gs.isEndingRound = false;
                                _capturedEngine.gs.isHandlingForcePick = false;
                                _capturedEngine.gs.forcePickProcessing = false;
                                _capturedEngine.startPhase1();
                            }, 1500);
                            return;
                        }
                        // Masih disconnect — akhiri game, beri rank terakhir
                        const takenRanks2 = new Set(_capturedEngine.gs.winners.map(w => w.rank));
                        let loserRank2 = 1;
                        while (takenRanks2.has(loserRank2)) loserRank2++;
                        _capturedLoser.rank = loserRank2; _capturedLoser.winner = true;
                        _capturedEngine.gs.winners.push(_capturedLoser);
                        _capturedEngine.broadcastLog(`💀 ${_capturedLoser.name} mendapat peringkat terakhir (disconnect)`);
                        setTimeout(() => { _capturedEngine.gs.isEndingRound = false; _capturedEngine.endGame(); }, 1000);
                    }, 10000);
                    // Simpan timer agar bisa di-cancel jika pemain reconnect
                    this._loserGraceTimer = _graceTimer;
                    return;
                }
                const takenRanks = new Set(this.gs.winners.map(w => w.rank));
                let loserRank = 1;
                while (takenRanks.has(loserRank)) loserRank++;
                loser.rank = loserRank; loser.winner = true;
                this.gs.winners.push(loser);
                this.broadcastLog(`💀 ${loser.name} mendapat peringkat terakhir`);
                setTimeout(() => { this.gs.isEndingRound = false; this.endGame(); }, 1000); return;
            }
            this.gs.round++;
            this.broadcastLog(`🎮 === RONDE ${this.gs.round} DIMULAI ===`);
            setTimeout(() => {
                this.gs.isEndingRound = false; this.gs.isHandlingForcePick = false;
                this.gs.forcePickProcessing = false; this.startPhase1();
            }, 1500);
        }, 1500);
    }

    endGame() {
        this.gs.gameOver = true;
        this.clearAllAfkTimers();
        const takenRanks = new Set(this.gs.winners.map(w => w.rank));
        let nextRank = 1;

        // [FIX v15] Pemain yang disconnect (autoMode=true & belum leftMatch) mendapat rank terakhir.
        // Urutkan: pemain yang menyelesaikan pertandingan normal → pemain disconnect/leftMatch.
        // Ini mencegah pemain disconnect mendapat rank acak di tengah berdasarkan urutan array.
        const normalPlayers     = this.gs.players.filter(p => !p.winner && !p.leftMatch && !p.autoMode);
        const disconnectedPlayers = this.gs.players.filter(p => !p.winner && (p.leftMatch || p.autoMode));

        normalPlayers.forEach(p => {
            while (takenRanks.has(nextRank)) nextRank++;
            p.rank = nextRank; takenRanks.add(nextRank); nextRank++;
        });
        disconnectedPlayers.forEach(p => {
            while (takenRanks.has(nextRank)) nextRank++;
            p.rank = nextRank; takenRanks.add(nextRank); nextRank++;
            console.log(`🔌 ${p.name} disconnect/keluar → rank ${p.rank} (terakhir)`);
        });

        let safeMax = Math.max(0, ...this.gs.players.map(p => p.rank));
        this.gs.players.filter(p => p.rank === 0).forEach(p => { p.rank = ++safeMax; });
        this.broadcastToAll({
            type: 'GAME_OVER',
            players: this.gs.players.map(p => ({ id: p.id, name: p.name, rank: p.rank, hand: p.hand, isBot: p.isBot })),
            isCustomRoom: this.isCustomRoom
        });
        saveProvinceStats(this.selectedProvinces, this.gs.players, this.roomId, this.isCustomRoom);
        this.gs.players
            .filter(p => !p.isBot && p.userUid && p.userUid !== "BOT" && !p.statsSaved && !this.isCustomRoom)
            .forEach(p => {
                const sock = p.socket;
                savePlayerStats(p.userUid, p.name, p.rank).then(ok => {
                    if (sock && sock.readyState === WebSocket.OPEN) {
                        try { sock.send(JSON.stringify({ type: ok ? "STATS_SAVED" : "SAVE_STATS_CLIENT", rank: p.rank })); } catch (_) {}
                    }
                }).catch(e => {});
            });
        if (this.onGameOver) setTimeout(() => this.onGameOver(), 2000);
    }

    markPlayerLeft(playerId) {
        const player = this.gs.players.find(p => p.id === playerId);
        if (!player || player.isBot) return false;
        player.leftMatch = true;
        const humans = this.gs.players.filter(p => !p.isBot);
        const leftCount = humans.filter(p => p.leftMatch).length;
        console.log(`🚪 ${player.name} keluar (${leftCount}/${humans.length})`);
        // [FIX #1] _spectatorLeft semantics:
        //   null  = ranked room (no spectator concept) → cleanup boleh jalan
        //   false = custom room, spectator masih terhubung/reconnectable → tahan cleanup
        //   true  = spectator sudah benar-benar keluar sukarela → cleanup boleh jalan
        // Sebelumnya: `=== false` juga menangkap null (false) untuk ranked → tidak apa-apa
        // secara kebetulan, tapi logikanya membingungkan dan rawan jika ada edge case.
        // Sekarang eksplisit: hanya blokir jika ini custom room DAN spectator belum left.
        if (this.isCustomRoom && this._spectatorLeft === false) return false;
        if (leftCount >= humans.length) { this.cleanupMatch(); return true; }
        return false;
    }

    markSpectatorLeft() {
        this._spectatorLeft = true;
        this.spectatorSockets = []; this.spectatorUserUids = [];
        const humans = this.gs.players.filter(p => !p.isBot);
        const leftCount = humans.filter(p => p.leftMatch).length;
        if (leftCount >= humans.length) { this.cleanupMatch(); return true; }
        return false;
    }

    cleanupMatch() {
        if (this.gs.gameOver) return;
        this.gs.gameOver = true;
        this.clearAllAfkTimers();
        console.log(`🧹 Match ${this.roomId} dibersihkan`);
        this.gs.players
            .filter(p => !p.isBot && p.userUid && p.userUid !== "BOT" && !p.statsSaved && p.winner && p.rank > 0 && !this.isCustomRoom)
            .forEach(p => {
                p.statsSaved = true;
                savePlayerStats(p.userUid, p.name, p.rank).then(ok => {
                    if (!ok) p.statsSaved = false;
                }).catch(e => { p.statsSaved = false; });
            });
        this.spectatorSockets = []; this.spectatorUserUids = [];
        if (this.onGameOver) setTimeout(() => this.onGameOver(), 2000);
    }

    getFullState() {
        const rarityStock = {};
        for (const rarity of RARITY_ORDER) rarityStock[rarity] = { remaining: 0, total: 0 };
        const cardsPool = this.selectedProvinces.length > 0
            ? ALL_CARDS.filter(c => this.selectedProvinces.includes(c.province))
            : ALL_CARDS;
        for (const card of cardsPool) { if (rarityStock[card.rarity]) rarityStock[card.rarity].total++; }
        for (const card of this.gs.drawPile) { if (rarityStock[card.rarity]) rarityStock[card.rarity].remaining++; }

        // Hitung stok per provinsi di drawPile
        const provinceStock = {};
        for (const card of this.gs.drawPile) {
            provinceStock[card.province] = (provinceStock[card.province] || 0) + 1;
        }

        // Hitung rarity tertinggi yang tersisa di drawPile (untuk penanda Reset Level di client)
        const RESET_HIERARCHY_GS = ['mythic','legendary','epic','rareplus','rarestar','rare','uncommon','uncommonplus','commonplus','common'];
        const remainingRarities = new Set(this.gs.drawPile.map(c => c.rarity));
        let highestResetRarity = null;
        for (const r of RESET_HIERARCHY_GS) { if (remainingRarities.has(r)) { highestResetRarity = r; break; } }

        return {
            round: this.gs.round, phase: this.gs.phase, phase1Player: this.gs.phase1Player,
            currentProvince: this.gs.currentProvince, topCard: this.gs.topCard,
            drawPile: this.gs.drawPile.map(c => ({ id: c.id })),
            discardPile: this.gs.discardPile.map(c => ({ id: c.id })),
            forcePickMode: this.gs.forcePickMode,
            forcePickPlayers: this.gs.forcePickPlayers.map(p => ({ id: p.id })),
            forcePickProcessing: this.gs.forcePickProcessing,
            isHandlingForcePick: this.gs.isHandlingForcePick,
            isEndingRound: this.gs.isEndingRound,
            players: this.gs.players.map(p => ({
                id: p.id, name: p.name, isBot: p.isBot, hand: p.hand,
                totalPower: p.totalPower, hasPlayed: p.hasPlayed, mustDraw: p.mustDraw,
                mustForcePick: p.mustForcePick, freed: p.freed, winner: p.winner,
                rank: p.rank, isProcessingAction: p.isProcessingAction,
                autoMode: p.autoMode, disconnectedAt: p.disconnectedAt,
                drawLevel: p.drawLevel ?? 1, drawCount: p.drawCount ?? 0,
                mustPlayMatching: p.mustPlayMatching ?? false,
                drawProb: p.drawProb ?? 0,
                drawOnceNoMatch: p.drawOnceNoMatch ?? false
            })),
            roundHistory: this.gs.roundHistory.slice(-10),
            winners: this.gs.winners.map(p => ({ id: p.id, name: p.name, rank: p.rank })),
            gameOver: this.gs.gameOver, rarityStock, provinceStock,
            highestResetRarity,
            isPaused: this.gs.isPaused ?? false, isCustomRoom: this.isCustomRoom
        };
    }

    broadcastGameState() {
        const state = this.getFullState();
        this.gs.players.forEach(p => {
            if (!p.isBot && p.socket) {
                try { p.socket.send(JSON.stringify({ type: 'GAME_STATE_UPDATE', state })); } catch(e) {}
            }
        });
        this.spectatorSockets.forEach(s => {
            if (s.readyState === WebSocket.OPEN) {
                try { s.send(JSON.stringify({ type: 'GAME_STATE_UPDATE', state, isSpectator: true })); } catch(e) {}
            }
        });
    }

    broadcastLog(message) {
        console.log(`📝 LOG: ${message}`);
        this.broadcastToAll({ type: 'LOG', message });
    }

    sendToPlayer(playerId, message) {
        const p = this.gs.players.find(p => p.id === playerId);
        if (p && !p.isBot && p.socket) { try { p.socket.send(JSON.stringify(message)); } catch(e) {} }
    }

    broadcastToAll(message) {
        this.gs.players.forEach(p => {
            if (!p.isBot && p.socket) { try { p.socket.send(JSON.stringify(message)); } catch(e) {} }
        });
        this.spectatorSockets.forEach(s => {
            if (s.readyState === WebSocket.OPEN) { try { s.send(JSON.stringify(message)); } catch(e) {} }
        });
    }

    updatePlayerSocket(playerId, socket) {
        const p = this.gs.players.find(p => p.id === playerId);
        if (p) { p.socket = socket; console.log(`🔄 Socket updated: ${p.name}`); }
    }

    getPlayerById(playerId) { return this.gs.players.find(p => p.id === playerId); }

    setPlayerAutoMode(playerId, enabled, reason = 'disconnect') {
        const player = this.gs.players.find(p => p.id === playerId);
        if (!player || player.isBot || player.winner) return;
        player.autoMode = enabled;
        if (enabled) {
            player.disconnectedAt = Date.now();
            console.log(`👤 AUTO-MODE ON: ${player.name}`);
            this.broadcastLog(`👤 ${player.name} ${reason} - mode otomatis aktif`);
            // [FIX] Beritahu client agar tampilkan banner notifikasi auto mode
            if (player.socket && player.socket.readyState === 1) {
                try { player.socket.send(JSON.stringify({ type: 'AUTO_MODE_NOTIFY', enabled: true })); } catch(e) {}
            }
            this.runAutoAction(player);
        } else {
            if (player.autoModeTimerId) { clearTimeout(player.autoModeTimerId); player.autoModeTimerId = undefined; }
            player.disconnectedAt = undefined;
            console.log(`👤 AUTO-MODE OFF: ${player.name}`);
            this.broadcastLog(`✅ ${player.name} kembali ke pertandingan`);
            // [FIX] Beritahu client untuk sembunyikan banner
            if (player.socket && player.socket.readyState === 1) {
                try { player.socket.send(JSON.stringify({ type: 'AUTO_MODE_NOTIFY', enabled: false })); } catch(e) {}
            }
            // [FIX v15] Cancel grace timer "pemain terakhir disconnect" jika masih berjalan
            if (this._loserGraceTimer) { clearTimeout(this._loserGraceTimer); this._loserGraceTimer = null; }
        }
        this.broadcastGameState();
    }

    runAutoAction(player) {
        if (this.gs.isPaused) { setTimeout(() => this.runAutoAction(player), 1000); return; }
        if (!player.autoMode || player.hasPlayed || player.winner || this.gs.gameOver) return;
        if (player.autoModeTimerId) { clearTimeout(player.autoModeTimerId); player.autoModeTimerId = undefined; }
        player.autoModeTimerId = setTimeout(() => {
            player.autoModeTimerId = undefined;
            if (!player.autoMode || player.hasPlayed || player.winner || this.gs.gameOver) return;
            if (this.gs.phase === 1 && this.gs.phase1Player === player.id && !player.hasPlayed) {
                if (player.hand.length > 0) {
                    const card = player.hand[Math.floor(Math.random() * player.hand.length)];
                    this.broadcastLog(`👤 AUTO: ${player.name} menjatuhkan ${card.name}`);
                    this.handlePlayCardInternal(player, card);
                }
                return;
            }
            if (this.gs.phase === 2 && player.mustPlayMatching && !player.hasPlayed) {
                const matchCard = player.hand.find(c => c.province === this.gs.currentProvince);
                if (matchCard) {
                    this.broadcastLog(`👤 AUTO: ${player.name} menjatuhkan kartu hasil draw: ${matchCard.name}`);
                    this.handlePlayCardInternal(player, matchCard);
                }
                return;
            }
            if (this.gs.phase === 2 && player.mustDraw && !player.hasPlayed) {
                this.broadcastLog(`👤 AUTO: ${player.name} Draw Card`);
                this.handleDrawCardInternal(player);
                return;
            }
            if (this.gs.phase === 2 && !player.hasPlayed && !player.mustDraw && !player.mustForcePick) {
                const matching = player.hand.filter(c => c.province === this.gs.currentProvince);
                if (matching.length > 0) {
                    const card = matching[Math.floor(Math.random() * matching.length)];
                    this.broadcastLog(`👤 AUTO: ${player.name} menjatuhkan ${card.name}`);
                    this.handlePlayCardInternal(player, card);
                }
                return;
            }
            if (this.gs.phase === 2 && player.mustForcePick && !player.hasPlayed && this.gs.forcePickMode) {
                if (this.gs.topCard.length > 0) {
                    const card = this.gs.topCard[Math.floor(Math.random() * this.gs.topCard.length)];
                    this.broadcastLog(`👤 AUTO: ${player.name} Mengambil kartu: ${card.name}`);
                    this.handleForcePickCardInternal(player, card.id);
                }
                return;
            }
        }, 3000);
    }
}

// =============================================
// MATCHMAKING QUEUE
// =============================================
class MatchmakingQueue {
    constructor() {
        this.queue = [];
        this.rooms = new Map();
        this.partyGroups = new Map();
        this.partyGroupTimeouts = new Map();
        this.partyCancelTimers = new Map();
        this.pendingCustomRooms = new Map();
        this.onlineRegistry = new Map();
        this.pendingInvites = new Map();
        this.partyLobbies = new Map();
        this.pendingPartyInvites = new Map();
        this.MATCH_SIZE = 4;
        this.WAIT_TIMEOUT = 30000;
        this.PARTY_WAIT = 30000;
    }

    addPlayer(player) {
        console.log(`✅ ${player.name} masuk antrian. Total: ${this.queue.length + 1}`);
        this.queue.push(player);
        if (player.partyId) {
            const pendingCancel = this.partyCancelTimers.get(player.partyId);
            if (pendingCancel) { clearTimeout(pendingCancel); this.partyCancelTimers.delete(player.partyId); }
            const group = this.partyGroups.get(player.partyId) || [];
            group.push(player);
            this.partyGroups.set(player.partyId, group);
            const expected = player.partySize ?? 2;
            if (group.length >= expected) { this.tryMatchParty(player.partyId); return; }
            if (group.length === 1) {
                const pid = player.partyId;
                const t = setTimeout(() => {
                    this.partyGroupTimeouts.delete(pid);
                    const g = this.partyGroups.get(pid);
                    if (g && g.length >= 2) this.tryMatchParty(pid);
                }, 20000);
                this.partyGroupTimeouts.set(pid, t);
            }
            return;
        }
        this.queue.forEach(p => {
            try { p.socket.send(JSON.stringify({ type: 'QUEUE_STATUS', message: `Mencari lawan... (${this.queue.length}/4)` })); } catch(e) {}
        });
        this.checkAndCreateMatch();
    }

    tryMatchParty(partyId) {
        const partyPlayers = this.partyGroups.get(partyId);
        if (!partyPlayers || partyPlayers.length < 2) return;
        const livePlayers = partyPlayers.filter(p => p.socket.readyState === WebSocket.OPEN);
        if (livePlayers.length < 2) { this.partyGroups.set(partyId, livePlayers); return; }
        this.partyGroups.delete(partyId);
        const _pt = this.partyGroupTimeouts.get(partyId);
        if (_pt) { clearTimeout(_pt); this.partyGroupTimeouts.delete(partyId); }
        livePlayers.forEach(pp => {
            const idx = this.queue.findIndex(q => q.id === pp.id);
            if (idx !== -1) { if (this.queue[idx].timeoutId) clearTimeout(this.queue[idx].timeoutId); this.queue.splice(idx, 1); }
        });
        const othersNeeded = this.MATCH_SIZE - livePlayers.length;
        const others = [];
        for (let i = 0; i < this.queue.length && others.length < othersNeeded; i++) {
            if (!this.queue[i].partyId) {
                others.push(this.queue[i]);
                if (this.queue[i].timeoutId) clearTimeout(this.queue[i].timeoutId);
                this.queue.splice(i, 1); i--;
            }
        }
        const allPlayers = [...livePlayers, ...others];
        const botsNeeded = this.MATCH_SIZE - allPlayers.length;
        if (others.length < othersNeeded && botsNeeded > 0) {
            console.log(`⏳ Party ${partyId} menunggu ${othersNeeded - others.length} pemain lagi...`);
            livePlayers.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'QUEUE_STATUS', message: `Party ditemukan! Mencari lawan... (${allPlayers.length}/4)` })); } catch(e) {} });
            this.partyGroups.set(partyId, livePlayers);
            const generation = Date.now();
            livePlayers._generation = generation;
            const waitTimer = setTimeout(() => {
                this.partyGroupTimeouts.delete(partyId);
                const currentGroup = this.partyGroups.get(partyId);
                if (currentGroup && currentGroup._generation !== generation) return;
                this.partyGroups.delete(partyId);
                const extraNeeded = this.MATCH_SIZE - allPlayers.length;
                const extra = [];
                for (let i = 0; i < this.queue.length && extra.length < extraNeeded; i++) {
                    if (!this.queue[i].partyId) { extra.push(this.queue[i]); if (this.queue[i].timeoutId) clearTimeout(this.queue[i].timeoutId); this.queue.splice(i, 1); i--; }
                }
                const finalPlayers = [...allPlayers, ...extra].filter(p => p.socket.readyState === WebSocket.OPEN);
                if (finalPlayers.filter(p => livePlayers.some(pp => pp.id === p.id)).length === 0) {
                    extra.forEach(p => { this.queue.unshift(p); }); return;
                }
                const finalBots = this.MATCH_SIZE - finalPlayers.length;
                finalPlayers.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'MATCH_STARTING', humans: finalPlayers.length, bots: finalBots })); } catch(e) {} });
                this.createMatch(finalPlayers, finalBots);
            }, this.PARTY_WAIT);
            this.partyGroupTimeouts.set(partyId, waitTimer);
            return;
        }
        allPlayers.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'MATCH_STARTING', humans: allPlayers.length, bots: botsNeeded })); } catch(e) {} });
        this.createMatch(allPlayers, botsNeeded);
    }

    checkAndCreateMatch() {
        if (this.queue.length >= this.MATCH_SIZE) {
            const players = this.queue.splice(0, this.MATCH_SIZE);
            players.forEach(p => {
                if (p.timeoutId) clearTimeout(p.timeoutId);
                try { p.socket.send(JSON.stringify({ type: 'MATCH_STARTING', humans: this.MATCH_SIZE, bots: 0 })); } catch(e) {}
            });
            this.createMatch(players, 0);
        } else if (this.queue.length > 0 && !this.queue[0].timeoutId) {
            this.queue[0].timeoutId = setTimeout(() => this.handleTimeout(), this.WAIT_TIMEOUT);
        }
    }

    handleTimeout() {
        const soloPlayers = this.queue.filter(p => !p.partyId);
        if (soloPlayers.length === 0) return;
        soloPlayers.forEach(p => {
            const idx = this.queue.findIndex(q => q.id === p.id);
            if (idx !== -1) { if (this.queue[idx].timeoutId) clearTimeout(this.queue[idx].timeoutId); this.queue.splice(idx, 1); }
        });
        const botsNeeded = this.MATCH_SIZE - soloPlayers.length;
        soloPlayers.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'MATCH_STARTING', humans: soloPlayers.length, bots: botsNeeded })); } catch(e) {} });
        this.createMatch(soloPlayers, botsNeeded).catch(e => {
            console.error('❌ createMatch gagal:', e);
            soloPlayers.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'ERROR', message: 'Gagal memulai match, coba lagi.' })); } catch(_) {} });
        });
    }

    async createMatch(players, botCount) {
        const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        const gameEngine = new GameEngine(roomId);
        const MANDATORY_PROVINCE = 'Bangka Belitung';
        const selectedProvinces = [MANDATORY_PROVINCE, ...await pickWeightedProvinces()];
        gameEngine.setSelectedProvinces(selectedProvinces);
        players.forEach(p => gameEngine.addPlayer({ id: p.id, name: p.name, isBot: false, socket: p.socket, userUid: p.userUid }));
        players.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'PROVINCES_SELECTED', provinces: selectedProvinces, mandatory: MANDATORY_PROVINCE, roomId, playerId: p.id })); } catch(e) {} });
        let botLevel = 1;
        let hasPlatinum = false;
        let hasStreakPlayer = false; // ada pemain dengan winStreak >= 4
        let streakPlayerName = '';
        const playerRankMap = {};
        if (botCount > 0 || players.length > 0) {
            try {
                const [rankResults, statsResults] = await Promise.all([
                    Promise.all(players.map(p => p.userUid ? fbRead(`/users/${p.userUid}/rankData`) : Promise.resolve(null))),
                    Promise.all(players.map(p => p.userUid ? fbRead(`/users/${p.userUid}/stats`) : Promise.resolve(null)))
                ]);
                for (let i = 0; i < rankResults.length; i++) {
                    const rd = rankResults[i];
                    if (!rd?.rankName) continue;
                    playerRankMap[players[i].name] = rd.rankName;
                    if (rd.rankName.startsWith("Platinum")) { hasPlatinum = true; }
                    if ((rd.rankName.startsWith("Gold") || rd.rankName.startsWith("Diamond")) && botLevel < 2) botLevel = 2;
                }
                if (hasPlatinum) botLevel = 3;
                // Cek win streak — hanya jika tidak ada Platinum (Platinum sudah Lv 3)
                if (!hasPlatinum) {
                    for (let i = 0; i < statsResults.length; i++) {
                        const st = statsResults[i];
                        if (st?.winStreak >= 4) {
                            hasStreakPlayer = true;
                            streakPlayerName = players[i].name;
                            break;
                        }
                    }
                }
            } catch (e) { console.warn("⚠️ Gagal fetch rank/stats untuk bot level:", e); }
        }
        const botLevelLabel = botLevel === 3 ? 'Level 3 (Platinum)' : botLevel === 2 ? 'Level 2 (Gold/Diamond)' : 'Level 1 (Bronze/Silver)';
        const botLevelAlasan = hasPlatinum
            ? `karena ada pemain berrank Platinum`
            : botLevel === 2
                ? `karena ada pemain berrank Gold/Diamond`
                : `karena semua pemain berrank Bronze/Silver atau tidak terdeteksi`;
        const addedBots = [];
        // Jika ada pemain streak >= 4 dan tidak ada Platinum, salah satu bot jadi Lv 3
        let streakBotAdded = false;
        for (let i = 0; i < botCount; i++) {
            const bName = GameEngine.pickBotName();
            let thisBotLevel = botLevel;
            if (hasStreakPlayer && !streakBotAdded) {
                thisBotLevel = 3;
                streakBotAdded = true;
            }
            gameEngine.addBot(bName, thisBotLevel);
            addedBots.push(`${bName}(Lv${thisBotLevel})`);
        }
        console.log(`🤖 BOT CHECK — Room: ${roomId} | botCount: ${botCount}`);
        if (botCount > 0) {
            console.log(`   📌 Jumlah bot    : ${botCount}`);
            console.log(`   🎯 Level bot dasar: ${botLevelLabel}`);
            console.log(`   💡 Alasan level  : ${botLevelAlasan}`);
            if (hasStreakPlayer && !hasPlatinum) {
                console.log(`   🔥 Streak trigger : ${streakPlayerName} punya winStreak >= 4 → 1 bot di-upgrade ke Lv3`);
            }
            console.log(`   🏅 Rank pemain   : ${Object.entries(playerRankMap).map(([n,r]) => `${n}=${r}`).join(', ') || '(tidak terdeteksi)'}`);
            console.log(`   🤖 Nama bot      : ${addedBots.join(', ')}`);
        } else {
            console.log(`   ℹ️  Tidak ada bot — room penuh dengan pemain manusia`);
            console.log(`   🏅 Rank pemain   : ${Object.entries(playerRankMap).map(([n,r]) => `${n}=${r}`).join(', ') || '(tidak terdeteksi)'}`);
        }
        const room = { id: roomId, players, bots: botCount, status: 'starting', gameEngine, createdAt: Date.now() };
        this.rooms.set(roomId, room);
        gameEngine.onGameOver = () => { room.status = 'finished'; room.finishedAt = Date.now(); console.log(`🏁 Room ${roomId} selesai`); };
        setTimeout(() => {
            try {
                room.status = 'playing';
                gameEngine.startGame();
                const startState = gameEngine.getFullState();
                players.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'GAME_STARTED', roomId, playerId: p.id, state: startState })); } catch(e) {} });
            } catch (err) {
                console.error(`❌ startGame error room ${roomId}:`, err);
                room.status = 'finished';
                players.forEach(p => { try { p.socket.send(JSON.stringify({ type: 'ERROR', message: 'Gagal memulai pertandingan.' })); } catch(_) {} });
            }
        }, 6000);
    }

    removePlayer(playerId) {
        const idx = this.queue.findIndex(p => p.id === playerId);
        if (idx !== -1) {
            const p = this.queue[idx];
            if (p.timeoutId) clearTimeout(p.timeoutId);
            const currentIdx = this.queue.findIndex(q => q.id === playerId);
            if (currentIdx !== -1) this.queue.splice(currentIdx, 1);
            if (p.partyId) {
                const group = this.partyGroups.get(p.partyId);
                if (group) {
                    const gi = group.findIndex(gp => gp.id === playerId);
                    if (gi !== -1) group.splice(gi, 1);
                    if (group.length > 0) {
                        const partyId = p.partyId;
                        const existingTimer = this.partyCancelTimers.get(partyId);
                        if (existingTimer) clearTimeout(existingTimer);
                        const cancelTimer = setTimeout(() => {
                            this.partyCancelTimers.delete(partyId);
                            const currentGroup = this.partyGroups.get(partyId);
                            if (!currentGroup || currentGroup.length === 0) return;
                            const cancelMsg = JSON.stringify({ type: 'PARTY_SEARCH_CANCELLED', cancelledByName: p.name });
                            currentGroup.forEach(gp => { try { gp.socket.send(cancelMsg); } catch(_) {} });
                            currentGroup.forEach(gp => {
                                const gIdx = this.queue.findIndex(q => q.id === gp.id);
                                if (gIdx !== -1) { if (this.queue[gIdx].timeoutId) clearTimeout(this.queue[gIdx].timeoutId); this.queue.splice(gIdx, 1); }
                            });
                            this.partyGroups.delete(partyId);
                            const _pt = this.partyGroupTimeouts.get(partyId);
                            if (_pt) { clearTimeout(_pt); this.partyGroupTimeouts.delete(partyId); }
                            this.queue.forEach(qp => { try { qp.socket.send(JSON.stringify({ type: 'QUEUE_STATUS', message: `Mencari lawan... (${this.queue.length}/4)` })); } catch(_) {} });
                            if (this.queue.length > 0 && !this.queue[0].timeoutId) this.queue[0].timeoutId = setTimeout(() => this.handleTimeout(), this.WAIT_TIMEOUT);
                        }, 3000);
                        this.partyCancelTimers.set(partyId, cancelTimer);
                    } else {
                        this.partyGroups.delete(p.partyId);
                        const _pt = this.partyGroupTimeouts.get(p.partyId);
                        if (_pt) { clearTimeout(_pt); this.partyGroupTimeouts.delete(p.partyId); }
                    }
                }
            }
            this.queue.forEach(qp => { try { qp.socket.send(JSON.stringify({ type: 'QUEUE_STATUS', message: `Mencari lawan... (${this.queue.length}/4)` })); } catch(_) {} });
            if (this.queue.length > 0 && !this.queue[0].timeoutId) this.queue[0].timeoutId = setTimeout(() => this.handleTimeout(), this.WAIT_TIMEOUT);
        }
    }

    getRoom(roomId) { return this.rooms.get(roomId); }

    rejoinRoom(roomId, playerId, playerName, userUid, socket) {
        const room = this.rooms.get(roomId);
        if (!room || (room.status !== 'playing' && room.status !== 'starting')) return false;
        const gamePlayer = room.gameEngine.getPlayerById(playerId);
        if (!gamePlayer) return false;
        if (gamePlayer.userUid && gamePlayer.userUid !== userUid) return false;
        if (gamePlayer.leftMatch) return false; // benar2 sudah keluar (tekan Kembali ke Home)
        // [FIX] Izinkan rejoin meski autoMode=true — autoMode hanya disconnect, bukan keluar sukarela
        // Restore socket yang null (akibat server restart/snapshot restore)
        room.gameEngine.updatePlayerSocket(playerId, socket);
        const rp = room.players.find(p => p.id === playerId);
        if (rp) rp.socket = socket;
        // [BUG FIX #7] JANGAN paksa status 'starting' → 'playing' di sini.
        // startGame() belum dipanggil saat status masih 'starting' — mengubah status
        // sebelum waktunya menyebabkan REJOIN_ROOM handler mengirim GAME_STARTED
        // dengan state kosong (deck belum dibagikan). Biarkan setTimeout 6 detik
        // yang mengubah status ke 'playing' secara normal.
        return true;
    }

    cleanupFinishedRooms() {
        const now = Date.now();
        const MAX_FINISHED_AGE = 5 * 60 * 1000;
        const MAX_PLAYING_AGE = 2 * 60 * 60 * 1000;
        this.rooms.forEach((room, roomId) => {
            if (room.status === 'finished') {
                const finishedTime = room.finishedAt ?? room.createdAt;
                if ((now - finishedTime) > MAX_FINISHED_AGE) { console.log(`🗑️ Cleanup finished room ${roomId}`); this.rooms.delete(roomId); }
            } else if ((now - room.createdAt) > MAX_PLAYING_AGE) {
                console.log(`🗑️ Cleanup stale room ${roomId}`);
                try { room.gameEngine.cleanupMatch(); } catch(_) {}
                this.rooms.delete(roomId);
            }
        });
        const MAX_PENDING_AGE = 2 * 60 * 60 * 1000;
        this.pendingCustomRooms.forEach((room, roomId) => {
            if (!room.started && (now - room.createdAt) > MAX_PENDING_AGE) { console.log(`🗑️ Cleanup stale pending custom room ${roomId}`); this.pendingCustomRooms.delete(roomId); }
        });
    }

    getStats() {
        const playing = [...this.rooms.values()].filter(r => r.status === 'playing').length;
        const finished = [...this.rooms.values()].filter(r => r.status === 'finished').length;
        return { waiting: this.queue.length, activeRooms: playing, finishedRooms: finished, totalCards: ALL_CARDS.length };
    }

    setPlayerAutoModeInAllRooms(playerId, enabled) {
        this.rooms.forEach((room) => {
            if (room.status === 'playing') {
                const gp = room.gameEngine.getPlayerById(playerId);
                if (gp) room.gameEngine.setPlayerAutoMode(playerId, enabled);
            }
        });
    }

    findRoomByUserUid(userUid) {
        if (!userUid || userUid === 'BOT') return null;
        for (const [roomId, room] of this.rooms) {
            if (room.status !== 'playing' && room.status !== 'starting') continue;
            const player = room.gameEngine.gs.players.find(p => !p.isBot && p.userUid === userUid && !p.leftMatch);
            if (player) return { roomId, playerId: player.id, playerName: player.name, isCustomRoom: room.gameEngine.isCustomRoom };
            if (room.gameEngine.spectatorUserUids.includes(userUid)) return { roomId, playerId: '', playerName: '', isCustomRoom: room.gameEngine.isCustomRoom, isSpectator: true };
        }
        return null;
    }

    rejoinAsSpectator(roomId, userUid, socket) {
        const room = this.rooms.get(roomId);
        // [FIX] Return string spesifik agar handler bisa membedakan kondisi:
        // 'not_found'     -> room tidak ada atau status tidak valid
        // 'not_spectator' -> userUid tidak terdaftar sebagai spectator
        // 'finished'      -> pertandingan sudah selesai (kirim GAME_OVER, bukan ERROR)
        // 'ok'            -> berhasil reconnect
        if (!room) return 'not_found';
        if (!room.gameEngine.spectatorUserUids.includes(userUid)) return 'not_spectator';
        // [FIX] Cek 'finished' SETELAH cek spectatorUserUids — agar spectator yang UID-nya
        // terdaftar tetap dapat GAME_OVER saat reconnect setelah pertandingan selesai.
        if (room.status === 'finished') return 'finished';
        if (room.status !== 'playing' && room.status !== 'starting') return 'not_found';
        if (room.gameEngine._spectatorReconnectTimer) { clearTimeout(room.gameEngine._spectatorReconnectTimer); room.gameEngine._spectatorReconnectTimer = undefined; }
        room.gameEngine.spectatorSockets.push(socket);
        room.gameEngine._spectatorLeft = false;
        return 'ok';
    }

    getPendingCustomRoom(roomId) { return this.pendingCustomRooms.get(roomId); }

    createPendingCustomRoom(hostName, hostUid, hostRole, hostSocket) {
        let roomId;
        do { roomId = `cr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`; }
        while (this.pendingCustomRooms.has(roomId) || this.rooms.has(roomId));
        const entry = { id: roomId, hostUid, hostRole, players: [], botSlots: {}, started: false, createdAt: Date.now() };
        let hostPlayerId;
        if (hostRole === 'pemain') {
            hostPlayerId = `crp_${Date.now()}`;
            entry.players.push({ id: hostPlayerId, name: hostName, socket: hostSocket, userUid: hostUid });
        } else {
            entry.spectatorSocket = hostSocket; entry.spectatorName = hostName; entry.spectatorUid = hostUid;
        }
        this.pendingCustomRooms.set(roomId, entry);
        return { roomId, hostPlayerId };
    }

    joinPendingCustomRoom(roomId, playerName, playerUid, socket) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room) {
            const startedRoom = this.rooms.get(roomId);
            if (startedRoom) return { success: false, error: 'Pertandingan sudah dimulai' };
            return { success: false, error: 'Room tidak ditemukan' };
        }
        if (room.started) return { success: false, error: 'Pertandingan sudah dimulai' };
        if (room.players.length + Object.keys(room.botSlots).length >= 4) return { success: false, error: 'Room sudah penuh' };
        if (room.players.some(p => p.userUid === playerUid)) return { success: false, error: 'Kamu sudah ada di room ini' };
        let pid;
        do { pid = `crp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
        while (room.players.some(p => p.id === pid));
        room.players.push({ id: pid, name: playerName, socket, userUid: playerUid });
        return { success: true, playerId: pid };
    }

    broadcastPendingCustomRoomUpdate(roomId) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room) return;

        // [FIX #2] EVICT GHOST PLAYERS — pemain yang socketnya sudah CLOSED/tidak OPEN
        // harus dikeluarkan dari room.players sebelum slot dihitung.
        // Tanpa ini, pemain yang crash/tutup tab tanpa kirim LEAVE_CUSTOM_ROOM
        // tetap terlihat di slot host, dan jika host mulai game mereka ikut dengan koneksi mati.
        // HOST (hostUid) dikecualikan dari eviction — host yang disconnect akan menghancurkan room via leavePendingCustomRoom.
        const ghostUids = room.players
            .filter(p => p.userUid !== room.hostUid && p.socket.readyState !== WebSocket.OPEN)
            .map(p => p.userUid);
        if (ghostUids.length > 0) {
            console.log(`👻 Evict ghost players dari room ${roomId}: ${ghostUids.join(', ')}`);
            room.players = room.players.filter(p => p.userUid === room.hostUid || p.socket.readyState === WebSocket.OPEN);
        }

        const slots = [];
        if (room.hostRole === 'pemain') {
            const hostPlayer = room.players.find(p => p.userUid === room.hostUid);
            if (hostPlayer) slots.push({ slot: 1, name: hostPlayer.name, uid: hostPlayer.userUid, isBot: false });
            const otherPlayers = room.players.filter(p => p.userUid !== room.hostUid);
            let nextHumanSlot = 2;
            for (const p of otherPlayers) {
                while (nextHumanSlot <= 4 && room.botSlots[nextHumanSlot]) nextHumanSlot++;
                if (nextHumanSlot > 4) break;
                slots.push({ slot: nextHumanSlot, name: p.name, uid: p.userUid, isBot: false });
                nextHumanSlot++;
            }
        } else {
            let nextHumanSlot = 1;
            for (const p of room.players) {
                while (nextHumanSlot <= 4 && room.botSlots[nextHumanSlot]) nextHumanSlot++;
                if (nextHumanSlot > 4) break;
                slots.push({ slot: nextHumanSlot, name: p.name, uid: p.userUid, isBot: false });
                nextHumanSlot++;
            }
        }
        Object.entries(room.botSlots).forEach(([pos, b]) => { slots.push({ slot: parseInt(pos), name: `Bot Lv${b.level}`, level: b.level, isBot: true, uid: null }); });
        const msg = JSON.stringify({ type: 'CUSTOM_ROOM_UPDATE', roomId, slots, totalSlots: slots.length, hostRole: room.hostRole, hostUid: room.hostUid });
        room.players.forEach(p => { if (p.socket.readyState === WebSocket.OPEN) { try { p.socket.send(msg); } catch(_) {} } });
        if (room.spectatorSocket?.readyState === WebSocket.OPEN) { try { room.spectatorSocket.send(msg); } catch(_) {} }
    }

    async startCustomRoomGame(roomId) {
        const room = this.pendingCustomRooms.get(roomId);
        const minHumans = room?.hostRole === 'penonton' ? 0 : 1;
        if (!room || room.started) return false;

        // [FIX #3] Validasi ulang: evict pemain yang socketnya sudah tidak OPEN sebelum game dimulai.
        // Ini mencegah "ghost player" — pemain yang crash/tutup tab tanpa LEAVE_CUSTOM_ROOM —
        // ikut masuk ke game dengan koneksi mati, yang menyebabkan slot kosong dan game tidak bisa selesai.
        const ghostsBefore = room.players.filter(p => p.userUid !== room.hostUid && p.socket.readyState !== WebSocket.OPEN);
        if (ghostsBefore.length > 0) {
            console.log(`👻 [startCustomRoomGame] Evict ${ghostsBefore.length} ghost player(s) sebelum start: ${ghostsBefore.map(p=>p.name).join(', ')}`);
            room.players = room.players.filter(p => p.userUid === room.hostUid || p.socket.readyState === WebSocket.OPEN);
            // Broadcast update agar host melihat slot terkini setelah eviction
            this.broadcastPendingCustomRoomUpdate(roomId);
        }

        const totalSlots = room.players.length + Object.keys(room.botSlots).length;
        if (totalSlots < 2 || room.players.length < minHumans) {
            console.log(`⚠️ [startCustomRoomGame] Batal: hanya ${totalSlots} slot setelah evict ghost (min 2).`);
            return false;
        }

        room.started = true;
        // [FIX] Batalkan semua undangan pending untuk room ini agar pemain yang belum merespons
        // tidak bisa masuk setelah game dimulai (mencegah race condition)
        for (const [invId, inv] of this.pendingInvites.entries()) {
            if (inv.roomId === roomId) {
                this.pendingInvites.delete(invId);
                const targetEntry = this.onlineRegistry.get(inv.toUid);
                if (targetEntry?.socket?.readyState === WebSocket.OPEN) {
                    try { targetEntry.socket.send(JSON.stringify({ type: 'INVITE_CANCELLED', roomId, reason: 'Pertandingan sudah dimulai' })); } catch(_) {}
                }
            }
        }
        try {
            const gameEngine = new GameEngine(roomId);
            gameEngine.isCustomRoom = true;
            gameEngine.hostUserUid = room.hostUid || null; // Set host UID untuk fitur pause
            if (room.spectatorSocket) gameEngine.addSpectator(room.spectatorSocket, room.spectatorUid);
            const MANDATORY_PROVINCE = 'Bangka Belitung';
            const selectedProvinces = [MANDATORY_PROVINCE, ...await pickWeightedProvinces()];
            gameEngine.setSelectedProvinces(selectedProvinces);
            room.players.forEach(p => gameEngine.addPlayer({ id: p.id, name: p.name, isBot: false, socket: p.socket, userUid: p.userUid }));
            const customBotNames = [];
            Object.values(room.botSlots).forEach(b => {
                const bName = `Bot Lv${b.level}`;
                gameEngine.addBot(bName, b.level);
                customBotNames.push(`${bName} (Level ${b.level})`);
            });
            if (customBotNames.length > 0) {
                console.log(`🤖 BOT CUSTOM ROOM — Room: ${roomId}`);
                console.log(`   📌 Jumlah bot  : ${customBotNames.length}`);
                console.log(`   🤖 Daftar bot  : ${customBotNames.join(', ')}`);
                console.log(`   👥 Pemain      : ${room.players.map(p => p.name).join(', ')}`);
            }
            const gameRoom = {
                id: roomId,
                players: room.players.map(p => ({ id: p.id, name: p.name, socket: p.socket, joinTime: Date.now(), userUid: p.userUid })),
                bots: Object.keys(room.botSlots).length, status: 'starting', gameEngine, createdAt: Date.now()
            };
            this.rooms.set(roomId, gameRoom);
            this.pendingCustomRooms.delete(roomId);
            gameEngine.onGameOver = () => {
                gameRoom.status = 'finished'; gameRoom.finishedAt = Date.now();
                setTimeout(() => { this.rooms.delete(roomId); }, 60000);
            };
            room.players.forEach(p => { if (p.socket.readyState === WebSocket.OPEN) { try { p.socket.send(JSON.stringify({ type: 'PROVINCES_SELECTED', provinces: selectedProvinces, mandatory: MANDATORY_PROVINCE, roomId, playerId: p.id })); } catch(_) {} } });
            if (room.spectatorSocket?.readyState === WebSocket.OPEN) { try { room.spectatorSocket.send(JSON.stringify({ type: 'PROVINCES_SELECTED', provinces: selectedProvinces, mandatory: MANDATORY_PROVINCE, roomId, playerId: null })); } catch(_) {} }
            setTimeout(() => {
                gameRoom.status = 'playing';
                gameEngine.startGame();
                const state = gameEngine.getFullState();
                room.players.forEach(p => { if (p.socket.readyState === WebSocket.OPEN) { try { p.socket.send(JSON.stringify({ type: 'GAME_STARTED', roomId, playerId: p.id, state, isCustomRoom: true })); } catch(_) {} } });
                if (room.spectatorSocket?.readyState === WebSocket.OPEN) { try { room.spectatorSocket.send(JSON.stringify({ type: 'GAME_STARTED', roomId, playerId: null, isSpectator: true, state, isCustomRoom: true })); } catch(_) {} }
            }, 6000);
            return true;
        } catch (error) {
            console.error(`❌ Gagal start custom room ${roomId}:`, error);
            room.started = false; this.rooms.delete(roomId);
            return false;
        }
    }

    // Party lobby methods
    createPartyLobby(leaderUid, leaderName, socket) {
        let id;
        do { id = `party_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; } while (this.partyLobbies.has(id));
        this.partyLobbies.set(id, { id, leaderId: leaderUid, members: [{ uid: leaderUid, name: leaderName, socket }] });
        return id;
    }

    inviteToParty(partyId, fromUid, toUid) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return { success: false, error: 'Party tidak ditemukan' };
        if (party.leaderId !== fromUid) return { success: false, error: 'Hanya leader yang bisa mengundang' };
        if (party.members.length >= 3) return { success: false, error: 'Party sudah penuh' };
        if (party.members.some(m => m.uid === toUid)) return { success: false, error: 'Pemain sudah ada di party' };
        const target = this.onlineRegistry.get(toUid);
        if (!target || target.socket.readyState !== WebSocket.OPEN) return { success: false, error: 'Pemain tidak tersedia' };
        const fromMember = party.members.find(m => m.uid === fromUid);
        const inviteId = `pinv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        this.pendingPartyInvites.set(inviteId, { fromUid, fromName: fromMember?.name ?? 'Leader', partyId, toUid });
        try { target.socket.send(JSON.stringify({ type: 'PARTY_INVITE', inviteId, partyId, fromName: fromMember?.name ?? 'Leader' })); }
        catch (_) { this.pendingPartyInvites.delete(inviteId); return { success: false, error: 'Gagal mengirim undangan' }; }
        setTimeout(() => this.pendingPartyInvites.delete(inviteId), 30000);
        return { success: true };
    }

    respondToPartyInvite(inviteId, toUid, accepted, socket, playerName) {
        const invite = this.pendingPartyInvites.get(inviteId);
        if (!invite || invite.toUid !== toUid) return { success: false, error: 'Undangan tidak valid' };
        this.pendingPartyInvites.delete(inviteId);
        const party = this.partyLobbies.get(invite.partyId);
        const notifyLeader = (msg) => {
            if (!party) return;
            const leader = party.members.find(m => m.uid === invite.fromUid);
            if (leader?.socket.readyState === WebSocket.OPEN) { try { leader.socket.send(JSON.stringify(msg)); } catch(_) {} }
        };
        if (!accepted) { notifyLeader({ type: 'PARTY_INVITE_DECLINED', toName: playerName }); return { success: false, error: 'Undangan ditolak' }; }
        if (!party || party.members.length >= 3) { notifyLeader({ type: 'PARTY_INVITE_DECLINED', toName: playerName, reason: 'Party sudah penuh' }); return { success: false, error: 'Party sudah penuh' }; }
        // [FIX] Tolak jika party sudah masuk antrian — pemain baru tidak akan ikut match
        if (party.queuing) { notifyLeader({ type: 'PARTY_INVITE_DECLINED', toName: playerName, reason: 'Party sedang dalam antrian' }); return { success: false, error: 'Party sudah dalam antrian, tidak bisa bergabung' }; }
        party.members.push({ uid: toUid, name: playerName, socket });
        return { success: true, partyId: invite.partyId, partySize: party.members.length };
    }

    broadcastPartyUpdate(partyId) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return;
        const msg = JSON.stringify({ type: 'PARTY_UPDATE', partyId, members: party.members.map(m => ({ uid: m.uid, name: m.name })), leaderId: party.leaderId });
        party.members.forEach(m => { if (m.socket.readyState === WebSocket.OPEN) { try { m.socket.send(msg); } catch(_) {} } });
    }

    disbandParty(partyId) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return;
        const msg = JSON.stringify({ type: 'PARTY_DISBANDED' });
        party.members.forEach(m => { if (m.socket.readyState === WebSocket.OPEN) { try { m.socket.send(msg); } catch(_) {} } });
        this.partyLobbies.delete(partyId);
    }

    leavePartyLobby(partyId, uid) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return;
        if (party.leaderId === uid) {
            if (party.queuing) { party.queuing.joinedUids.forEach(joinedUid => { const p = this.queue.find(p => p.userUid === joinedUid && p.partyId === party.queuing.sharedPartyId); if (p) this.removePlayer(p.id); }); }
            this.disbandParty(partyId);
        } else {
            const leavingMember = party.members.find(m => m.uid === uid);
            const idx = party.members.findIndex(m => m.uid === uid);
            if (idx !== -1) party.members.splice(idx, 1);
            if (party.queuing) {
                const leavingName = leavingMember?.name || uid;
                const cancelMsg = JSON.stringify({ type: 'PARTY_SEARCH_CANCELLED', cancelledByName: leavingName, disconnectedUid: uid });
                party.members.forEach(m => { if (m.socket.readyState === WebSocket.OPEN) { try { m.socket.send(cancelMsg); } catch(_) {} } });
                this.partyLobbies.delete(partyId);
            } else { this.broadcastPartyUpdate(partyId); }
        }
    }

    startPartyQueue(partyId, leaderUid) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return { success: false, error: 'Party tidak ditemukan' };
        if (party.leaderId !== leaderUid) return { success: false, error: 'Hanya leader yang bisa memulai antrian' };
        if (party.members.length < 2) return { success: false, error: 'Party butuh minimal 2 pemain' };
        if (party.queuing) { party.queuing.joinedUids.forEach(uid => { const existing = this.queue.find(p => p.userUid === uid && p.partyId === party.queuing.sharedPartyId); if (existing) this.removePlayer(existing.id); }); }
        const sharedPartyId = `qp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const size = party.members.length;
        party.queuing = { sharedPartyId, partySize: size, joinedUids: new Set() };
        party.members.forEach(m => { this.unregisterOnline(m.uid); if (m.socket.readyState === WebSocket.OPEN) { try { m.socket.send(JSON.stringify({ type: 'PARTY_QUEUING', sharedPartyId, partySize: size })); } catch(_) {} } });
        setTimeout(() => { const p = this.partyLobbies.get(partyId); if (p?.queuing?.sharedPartyId === sharedPartyId) { console.log(`⏰ Party ${partyId} queuing timeout`); this.partyLobbies.delete(partyId); } }, 15000);
        return { success: true, sharedPartyId, partySize: size };
    }

    updatePartyMemberSocket(partyId, uid, socket) {
        const party = this.partyLobbies.get(partyId);
        if (!party) return false;
        const member = party.members.find(m => m.uid === uid);
        if (!member) return false;
        member.socket = socket;
        return true;
    }

    findQueueingPartyByMember(uid) {
        for (const [partyId, party] of this.partyLobbies) {
            if (party.queuing && party.members.some(m => m.uid === uid)) return { partyId, sharedPartyId: party.queuing.sharedPartyId, partySize: party.queuing.partySize };
        }
        return null;
    }

    confirmPartyQueueJoin(sharedPartyId, uid) {
        for (const [partyId, party] of this.partyLobbies) {
            if (party.queuing?.sharedPartyId === sharedPartyId) {
                party.queuing.joinedUids.add(uid);
                if (party.queuing.joinedUids.size >= party.queuing.partySize) { console.log(`✅ Party ${partyId} semua anggota masuk antrian`); this.partyLobbies.delete(partyId); }
                return;
            }
        }
    }

    addBotSlotToCustomRoom(roomId, level, requestingUid, slotPosition) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room || room.started) return { success: false, error: 'Room tidak valid' };
        if (room.hostUid !== requestingUid) return { success: false, error: 'Hanya host yang bisa menambah bot' };
        const minSlot = room.hostRole === 'pemain' ? 2 : 1;
        if (slotPosition < minSlot || slotPosition > 4) return { success: false, error: 'Posisi slot tidak valid' };
        if (room.botSlots[slotPosition]) return { success: false, error: 'Slot sudah ada bot' };
        if (room.hostRole === 'pemain' && slotPosition === 1) return { success: false, error: 'Slot sudah ditempati pemain (host)' };
        if (room.players.length + Object.keys(room.botSlots).length >= 4) return { success: false, error: 'Room sudah penuh' };
        if (level < 1 || level > 3) return { success: false, error: 'Level bot harus 1–3' };
        room.botSlots[slotPosition] = { level };
        return { success: true };
    }

    removeBotSlotFromCustomRoom(roomId, slotPosition, requestingUid) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room || room.started) return { success: false, error: 'Room tidak valid' };
        if (room.hostUid !== requestingUid) return { success: false, error: 'Hanya host yang bisa menghapus bot' };
        if (!room.botSlots[slotPosition]) return { success: false, error: 'Tidak ada bot di slot tersebut' };
        delete room.botSlots[slotPosition];
        return { success: true };
    }

    registerOnline(userUid, name, socket) { this.onlineRegistry.set(userUid, { name, socket }); }
    unregisterOnline(userUid) { this.onlineRegistry.delete(userUid); }
    getOnlinePlayers(excludeUid) {
        const result = [];
        this.onlineRegistry.forEach((v, uid) => { if (uid !== excludeUid && v.socket.readyState === WebSocket.OPEN) result.push({ uid, name: v.name }); });
        return result;
    }

    invitePlayerToCustomRoom(roomId, fromUid, toUid) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room || room.started) return { success: false, error: 'Room tidak valid' };
        if (room.hostUid !== fromUid) return { success: false, error: 'Hanya host yang bisa mengundang' };
        if (room.players.length + Object.keys(room.botSlots).length >= 4) return { success: false, error: 'Room sudah penuh' };
        if (room.players.some(p => p.userUid === toUid)) return { success: false, error: 'Pemain sudah ada di room' };
        const target = this.onlineRegistry.get(toUid);
        if (!target || target.socket.readyState !== WebSocket.OPEN) return { success: false, error: 'Pemain tidak tersedia' };
        const fromPlayer = room.players.find(p => p.userUid === fromUid);
        const fromName = fromPlayer?.name ?? room.spectatorName ?? 'Host';
        const inviteId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        this.pendingInvites.set(inviteId, { fromUid, fromName, roomId, toUid });
        try { target.socket.send(JSON.stringify({ type: 'ROOM_INVITE', inviteId, roomId, fromName })); }
        catch (_) { this.pendingInvites.delete(inviteId); return { success: false, error: 'Gagal mengirim undangan' }; }
        setTimeout(() => this.pendingInvites.delete(inviteId), 30000);
        return { success: true };
    }

    respondToInvite(inviteId, toUid, accepted, socket, playerName) {
        const invite = this.pendingInvites.get(inviteId);
        if (!invite || invite.toUid !== toUid) return { success: false, error: 'Undangan tidak valid' };
        this.pendingInvites.delete(inviteId);
        const room = this.pendingCustomRooms.get(invite.roomId);
        // [FIX] notifyHost tetap bisa dipanggil meski room sudah pindah ke rooms (race condition)
        const notifyHost = (msg) => {
            if (room) {
                const hostPlayer = room.players.find(p => p.userUid === invite.fromUid);
                const hostSocket = hostPlayer?.socket ?? (room.spectatorUid === invite.fromUid ? room.spectatorSocket : undefined);
                if (hostSocket?.readyState === WebSocket.OPEN) { try { hostSocket.send(JSON.stringify(msg)); } catch (_) {} }
                return;
            }
            // Room sudah dimulai — coba cari host di rooms (GameEngine)
            const startedRoom = this.rooms.get(invite.roomId);
            if (startedRoom) {
                const hostP = startedRoom.players.find(p => p.userUid === invite.fromUid);
                if (hostP?.socket?.readyState === WebSocket.OPEN) { try { hostP.socket.send(JSON.stringify(msg)); } catch (_) {} }
            }
        };
        if (!accepted) { notifyHost({ type: 'INVITE_DECLINED', toName: playerName }); return { success: false, error: 'Undangan ditolak' }; }
        // [FIX] Deteksi dini race condition: room sudah dimulai sebelum pemain sempat join
        if (!room) {
            const errMsg = this.rooms.has(invite.roomId) ? 'Pertandingan sudah dimulai' : 'Room tidak ditemukan';
            notifyHost({ type: 'INVITE_DECLINED', toName: playerName, reason: errMsg });
            return { success: false, error: errMsg };
        }
        if (room.started) {
            notifyHost({ type: 'INVITE_DECLINED', toName: playerName, reason: 'Pertandingan sudah dimulai' });
            return { success: false, error: 'Pertandingan sudah dimulai' };
        }
        const joinResult = this.joinPendingCustomRoom(invite.roomId, playerName, toUid, socket);
        if (!joinResult.success) { notifyHost({ type: 'INVITE_DECLINED', toName: playerName, reason: joinResult.error }); return { success: false, error: joinResult.error }; }
        return { success: true, roomId: invite.roomId, playerId: joinResult.playerId };
    }

    kickFromCustomRoom(roomId, targetUid, requestingUid) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room || room.started) return { success: false, error: 'Room tidak valid' };
        if (room.hostUid !== requestingUid) return { success: false, error: 'Hanya host yang bisa mengeluarkan pemain' };
        const idx = room.players.findIndex(p => p.userUid === targetUid);
        if (idx === -1) return { success: false, error: 'Pemain tidak ditemukan' };
        const kickedPlayer = room.players[idx];
        if (kickedPlayer.socket.readyState === WebSocket.OPEN) { try { kickedPlayer.socket.send(JSON.stringify({ type: 'KICKED_FROM_ROOM', roomId })); } catch(_) {} }
        room.players.splice(idx, 1);
        this.broadcastPendingCustomRoomUpdate(roomId);
        return { success: true };
    }

    leavePendingCustomRoom(roomId, userUid, isSpectatorRole) {
        const room = this.pendingCustomRooms.get(roomId);
        if (!room || room.started) return;
        const isHost = userUid === room.hostUid;
        if (isSpectatorRole) { room.spectatorSocket = undefined; }
        else { const idx = room.players.findIndex(p => p.userUid === userUid); if (idx !== -1) room.players.splice(idx, 1); }
        if (isHost) {
            const disbandMsg = JSON.stringify({ type: 'ROOM_DISBANDED' });
            room.players.forEach(p => { if (p.socket.readyState === WebSocket.OPEN) { try { p.socket.send(disbandMsg); } catch(_) {} } });
            if (room.spectatorSocket?.readyState === WebSocket.OPEN) { try { room.spectatorSocket.send(disbandMsg); } catch(_) {} }
            this.pendingCustomRooms.delete(roomId);
            return;
        }
        const hasLivePlayer = room.players.some(p => p.socket.readyState === WebSocket.OPEN);
        const hasLiveSpectator = room.spectatorSocket != null && room.spectatorSocket.readyState === WebSocket.OPEN;
        if (!hasLivePlayer && !hasLiveSpectator) { this.pendingCustomRooms.delete(roomId); }
        else { this.broadcastPendingCustomRoomUpdate(roomId); }
    }
}

// =============================================
// MAIN SERVER
// =============================================
const matchmaking = new MatchmakingQueue();
setInterval(() => matchmaking.cleanupFinishedRooms(), 60000);

// [FIX #4] Periodic ghost-player eviction dari pending custom rooms.
// Setiap 10 detik, cek semua pendingCustomRooms: jika ada non-host player
// dengan socket CLOSED/tidak OPEN, evict mereka dan broadcast update ke host.
// Ini memastikan host selalu melihat slot yang akurat meski pemain crash tanpa LEAVE_CUSTOM_ROOM.
setInterval(() => {
    for (const [roomId, room] of matchmaking.pendingCustomRooms) {
        if (room.started) continue;
        const ghosts = room.players.filter(p => p.userUid !== room.hostUid && p.socket.readyState !== WebSocket.OPEN);
        if (ghosts.length > 0) {
            console.log(`🔄 [GhostCheck] Evict ${ghosts.length} ghost(s) dari pending room ${roomId}: ${ghosts.map(p=>p.name).join(', ')}`);
            room.players = room.players.filter(p => p.userUid === room.hostUid || p.socket.readyState === WebSocket.OPEN);
            matchmaking.broadcastPendingCustomRoomUpdate(roomId);
        }
    }
}, 10000);

const pendingAutoModeTimers = new Map();
// [BUG FIX] Map untuk track timer 120 detik markPlayerLeft di custom room.
// Timer ini harus di-cancel saat pemain reconnect (REJOIN_ROOM), jika tidak
// pemain yang sudah berhasil reconnect tetap akan ter-markLeft setelah 120 detik.
const pendingCustomMarkLeftTimers = new Map();

console.log(`🎮 Card Game Nusantara Server v2 (Node.js)`);
console.log(`📦 Total kartu: ${ALL_CARDS.length} (${ALL_PROVINCES.length} provinsi × 10) | Per match: 16 provinsi × 10 = 160 kartu`);

// HTTP Routes
app.get('/stats', (req, res) => res.json(matchmaking.getStats()));
app.get('/health', (req, res) => res.send('OK'));
app.get('/leaderboard', async (req, res) => {
    const token = await fbGetToken();
    if (!token) return res.status(503).json({ error: "Firebase not configured" });
    const limit = Math.min(parseInt(req.query.limit || '100'), 500);
    const fbRes = await fetch(`${FB_DB_URL}/leaderboard.json`, { headers: { Authorization: `Bearer ${token}` } });
    if (!fbRes.ok) return res.status(502).json({ error: "Failed to fetch leaderboard" });
    const raw = await fbRes.json();
    if (!raw) return res.json([]);
    const entries = Object.entries(raw).map(([uid, d]) => ({ uid, name: d.name, rankName: d.rankName, points: d.points, peakRank: d.peakRank, updatedAt: d.updatedAt }));
    entries.sort((a, b) => {
        const ai = RANKS.indexOf(a.rankName ?? "Bronze III");
        const bi = RANKS.indexOf(b.rankName ?? "Bronze III");
        if (bi !== ai) return bi - ai;
        return (b.points ?? 0) - (a.points ?? 0);
    });
    res.set('Access-Control-Allow-Origin', '*').json(entries.slice(0, limit));
});
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) { res.sendFile(htmlPath); }
    else { res.status(404).send('index.html not found'); }
});

// WebSocket Handler
wss.on('connection', (socket) => {
    let currentPlayer = null;
    let lastPong = Date.now();
    let pingInterval;
    let currentCustomRoomId = null;
    let isCustomRoomSpectator = false;
    let currentPartyId = null;

    console.log("🔌 New connection");
    lastPong = Date.now();
    pingInterval = setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) { clearInterval(pingInterval); return; }
        if (Date.now() - lastPong > 45000) {
            console.log(`⏰ Ping timeout: ${currentPlayer?.name || 'unknown'}`);
            clearInterval(pingInterval);
            try { socket.close(); } catch(_) {}
            return;
        }
        try { socket.send(JSON.stringify({ type: 'PING' })); } catch(_) { clearInterval(pingInterval); }
    }, 20000);

    socket.on('message', (rawData) => {
        try {
            const data = JSON.parse(rawData);
            switch (data.type) {
                case 'JOIN_MATCHMAKING':
                    if (socket.readyState !== WebSocket.OPEN) break;
                    currentPlayer = {
                        id: `player_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                        name: sanitizeName(data.playerName) || `Player_${Math.floor(Math.random()*9999)}`,
                        socket, joinTime: Date.now(),
                        userUid: data.userUid || '',
                        partyId: data.partyId || undefined,
                        partySize: data.partySize ? Math.min(Math.max(parseInt(data.partySize, 10), 2), 3) : undefined
                    };
                    if (data.userUid) matchmaking.unregisterOnline(data.userUid);
                    if (data.partyId && data.userUid) matchmaking.confirmPartyQueueJoin(data.partyId, data.userUid);
                    currentPartyId = null;
                    matchmaking.addPlayer(currentPlayer);
                    break;

                case 'LEAVE_QUEUE':
                    if (currentPlayer) matchmaking.removePlayer(currentPlayer.id);
                    break;

                case 'PLAY_CARD':
                case 'DRAW_CARD':
                case 'FORCE_PICK_CARD':
                    if (currentPlayer && data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room) {
                            if (room.gameEngine.gs.isPaused) {
                                try { socket.send(JSON.stringify({ type: 'ERROR', message: '⏸️ Pertandingan sedang dijeda oleh host.' })); } catch(_) {}
                            } else {
                                room.gameEngine.handlePlayerAction(currentPlayer.id, data);
                            }
                        }
                    }
                    break;

                case 'PAUSE_GAME': {
                    if (isCustomRoomSpectator && currentCustomRoomId && data.userUid) {
                        const room = matchmaking.getRoom(currentCustomRoomId);
                        if (room && room.gameEngine.isCustomRoom) {
                            const res = room.gameEngine.handlePause(data.userUid);
                            if (!res.success) { try { socket.send(JSON.stringify({ type: 'ERROR', message: res.error })); } catch(_) {} }
                        }
                    } else {
                        try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Hanya host penonton yang dapat pause.' })); } catch(_) {}
                    }
                    break;
                }

                case 'SET_AUTO_MODE':
                    if (currentPlayer && data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room) room.gameEngine.setPlayerAutoMode(currentPlayer.id, data.enabled);
                    }
                    break;

                case 'PLAYER_ACTIVE':
                    if (currentPlayer && data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room) {
                            room.gameEngine.setPlayerAutoMode(currentPlayer.id, false);
                            try { socket.send(JSON.stringify({ type: 'GAME_STATE_UPDATE', state: room.gameEngine.getFullState() })); } catch(e) {}
                        }
                    }
                    break;

                case 'SURRENDER':
                    if (isCustomRoomSpectator) { try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Spectator tidak dapat menyerah.' })); } catch(_) {} }
                    else if (currentPlayer && data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room) room.gameEngine.handleSurrender(currentPlayer.id);
                    }
                    break;

                case 'LEAVE_MATCH':
                    if (data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room && room.status === 'playing') {
                            if (data.isSpectator) {
                                const allLeft = room.gameEngine.markSpectatorLeft();
                                if (allLeft) { room.status = 'finished'; room.finishedAt = Date.now(); }
                                if (currentCustomRoomId === data.roomId) { currentCustomRoomId = null; isCustomRoomSpectator = false; }
                            } else if (currentPlayer) {
                                const allLeft = room.gameEngine.markPlayerLeft(currentPlayer.id);
                                if (allLeft) { room.status = 'finished'; room.finishedAt = Date.now(); }
                            }
                        }
                    }
                    break;

                case 'FIND_MY_ROOM':
                    if (data.userUid) {
                        const found = matchmaking.findRoomByUserUid(data.userUid);
                        try { socket.send(JSON.stringify(found ? { type: 'ROOM_FOUND', ...found } : { type: 'ROOM_NOT_FOUND' })); } catch(_) {}
                    }
                    break;

                case 'PONG':
                    lastPong = Date.now();
                    break;

                case 'REJOIN_ROOM':
                    if (data.roomId && data.playerId) {
                        const pendingTimer = pendingAutoModeTimers.get(data.playerId);
                        if (pendingTimer) { clearTimeout(pendingTimer); pendingAutoModeTimers.delete(data.playerId); }
                        // [BUG FIX] Cancel juga timer markPlayerLeft custom room agar pemain
                        // yang berhasil reconnect tidak ter-kick secara paksa setelah 120 detik
                        const pendingMarkLeft = pendingCustomMarkLeftTimers.get(data.playerId);
                        if (pendingMarkLeft) { clearTimeout(pendingMarkLeft); pendingCustomMarkLeftTimers.delete(data.playerId); }
                        const success = matchmaking.rejoinRoom(data.roomId, data.playerId, data.playerName || 'Player', data.userUid || '', socket);
                        if (success) {
                            currentPlayer = { id: data.playerId, name: data.playerName || 'Player', socket, joinTime: Date.now(), userUid: data.userUid || '' };
                            const room = matchmaking.getRoom(data.roomId);
                            if (room) {
                                room.gameEngine.setPlayerAutoMode(data.playerId, false);
                                // [BUG FIX #7] Jangan cek room.status untuk menentukan respons rejoin,
                                // karena rejoinRoom() sudah mengubah 'starting' → 'playing' sebelum
                                // startGame() dipanggil. Cek gs.drawPile.length untuk memastikan
                                // startGame() sudah benar-benar dijalankan (deck terisi).
                                // Jika belum: kirim PROVINCES_SELECTED agar client ikut countdown.
                                // Jika sudah: kirim GAME_STARTED dengan state lengkap.
                                const gameActuallyStarted = room.gameEngine.gs.drawPile.length > 0;
                                if (gameActuallyStarted) {
                                    try { socket.send(JSON.stringify({ type: 'GAME_STARTED', roomId: data.roomId, playerId: data.playerId, state: room.gameEngine.getFullState(), isCustomRoom: room.gameEngine.isCustomRoom })); } catch(_) {}
                                } else {
                                    const remainingMs = Math.max(0, 6000 - (Date.now() - room.createdAt));
                                    try { socket.send(JSON.stringify({ type: 'PROVINCES_SELECTED', provinces: room.gameEngine.selectedProvinces, mandatory: 'Bangka Belitung', remainingMs, roomId: data.roomId, playerId: data.playerId })); } catch(_) {}
                                    try { socket.send(JSON.stringify({ type: 'GAME_STATE_UPDATE', state: room.gameEngine.getFullState() })); } catch(_) {}
                                }
                            }
                        } else {
                            const finishedRoom = matchmaking.getRoom(data.roomId);
                            if (finishedRoom && finishedRoom.status === 'finished') {
                                const gp = finishedRoom.gameEngine.getPlayerById(data.playerId);
                                const uidOk = gp && (!gp.userUid || gp.userUid === (data.userUid || ''));
                                if (uidOk) {
                                    try { socket.send(JSON.stringify({ type: 'GAME_OVER', players: finishedRoom.gameEngine.gs.players.map(p => ({ id: p.id, name: p.name, rank: p.rank, hand: p.hand, isBot: p.isBot })), isCustomRoom: finishedRoom.gameEngine.isCustomRoom })); } catch(_) {}
                                    if (gp && gp.rank > 0) { try { socket.send(JSON.stringify({ type: 'SAVE_STATS_CLIENT', rank: gp.rank })); } catch (_) {} }
                                } else { try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Akun tidak cocok.' })); } catch(_) {} }
                            } else { try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Room tidak ditemukan atau sudah berakhir.' })); } catch(_) {} }
                        }
                    }
                    break;

                case 'REJOIN_AS_SPECTATOR':
                    if (data.roomId && data.userUid) {
                        const rejoinResult = matchmaking.rejoinAsSpectator(data.roomId, data.userUid, socket);
                        if (rejoinResult === 'ok') {
                            // Berhasil reconnect sebagai spectator
                            isCustomRoomSpectator = true; currentCustomRoomId = data.roomId;
                            // [BUG FIX] Set currentPlayer dengan userUid spectator agar saat
                            // socket disconnect lagi, removeSpectator() menerima userUid yang
                            // benar (bukan string kosong). Tanpa ini, spectator yang reconnect
                            // lalu disconnect lagi akan kehilangan UID-nya dari spectatorUserUids
                            // sehingga tidak bisa rejoin ketiga kalinya.
                            if (!currentPlayer) currentPlayer = { id: data.userUid, name: data.userUid, socket, joinTime: Date.now(), userUid: data.userUid };
                            else currentPlayer.userUid = data.userUid;
                            const room = matchmaking.getRoom(data.roomId);
                            if (room) { try { socket.send(JSON.stringify({ type: 'GAME_STARTED', roomId: data.roomId, playerId: null, state: room.gameEngine.getFullState(), isCustomRoom: true, isSpectator: true })); } catch(_) {} }
                        } else if (rejoinResult === 'finished') {
                            // [FIX] Pertandingan sudah selesai tapi room belum di-cleanup ->
                            // kirim GAME_OVER agar spectator bisa lihat hasil akhir, bukan ERROR.
                            const finishedRoom = matchmaking.getRoom(data.roomId);
                            if (finishedRoom) {
                                try { socket.send(JSON.stringify({ type: 'GAME_OVER', players: finishedRoom.gameEngine.gs.players.map(p => ({ id: p.id, name: p.name, rank: p.rank, hand: p.hand, isBot: p.isBot })), isCustomRoom: finishedRoom.gameEngine.isCustomRoom, isSpectator: true })); } catch(_) {}
                            } else {
                                try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Pertandingan telah berakhir.' })); } catch(_) {}
                            }
                        } else if (rejoinResult === 'not_spectator') {
                            // [FIX] UID tidak terdaftar — ini seharusnya tidak terjadi lagi setelah
                            // fix removeSpectator, tapi tetap tangani dengan baik.
                            // Coba cari room via FIND_MY_ROOM flow sebagai fallback.
                            const fallbackRoom = matchmaking.getRoom(data.roomId);
                            if (fallbackRoom && (fallbackRoom.status === 'playing' || fallbackRoom.status === 'starting')) {
                                // Room masih aktif tapi UID tidak di-list -> mungkin UID hilang
                                // karena bug lama. Re-register spectator agar bisa masuk.
                                fallbackRoom.gameEngine.addSpectator(socket, data.userUid);
                                isCustomRoomSpectator = true; currentCustomRoomId = data.roomId;
                                try { socket.send(JSON.stringify({ type: 'GAME_STARTED', roomId: data.roomId, playerId: null, state: fallbackRoom.gameEngine.getFullState(), isCustomRoom: true, isSpectator: true })); } catch(_) {}
                            } else {
                                try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Sesi penonton tidak valid.' })); } catch(_) {}
                            }
                        } else {
                            // 'not_found' -> room benar-benar tidak ada
                            try { socket.send(JSON.stringify({ type: 'ERROR', message: 'Room tidak ditemukan atau sesi penonton tidak valid.' })); } catch(_) {}
                        }
                    }
                    break;

                case 'CREATE_CUSTOM_ROOM':
                    if (currentCustomRoomId) {
                        const _staleP = matchmaking.getPendingCustomRoom(currentCustomRoomId);
                        const _staleA = matchmaking.getRoom(currentCustomRoomId);
                        if (!_staleP && !_staleA) { currentCustomRoomId = null; isCustomRoomSpectator = false; }
                    }
                    if (!currentCustomRoomId && data.userUid) {
                        const _staleFound = matchmaking.findRoomByUserUid(data.userUid);
                        if (_staleFound?.isSpectator) {
                            const _staleRoom = matchmaking.getRoom(_staleFound.roomId);
                            if (_staleRoom?.gameEngine) _staleRoom.gameEngine.removeSpectator(socket, data.userUid);
                        }
                    }
                    if (currentCustomRoomId || (data.userUid && matchmaking.findRoomByUserUid(data.userUid))) {
                        socket.send(JSON.stringify({ type: 'ERROR', message: 'Sudah berada di room lain. Keluar dulu.' }));
                    } else if (data.playerName && data.userUid && (data.role === 'pemain' || data.role === 'penonton')) {
                        const sanitizedName = sanitizeName(data.playerName) || 'Player';
                        const crResult = matchmaking.createPendingCustomRoom(sanitizedName, data.userUid, data.role, socket);
                        currentCustomRoomId = crResult.roomId;
                        isCustomRoomSpectator = data.role === 'penonton';
                        if (data.role === 'pemain' && crResult.hostPlayerId) currentPlayer = { id: crResult.hostPlayerId, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                        else if (data.role === 'penonton') currentPlayer = { id: data.userUid, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                        socket.send(JSON.stringify({ type: 'CUSTOM_ROOM_CREATED', roomId: crResult.roomId }));
                    }
                    break;

                case 'JOIN_CUSTOM_ROOM':
                    if (currentCustomRoomId) {
                        const _prevRoom = matchmaking.getPendingCustomRoom(currentCustomRoomId);
                        const _uid = currentPlayer?.userUid || data.userUid;
                        if (!_prevRoom || (!_prevRoom.players.some(p => p.userUid === _uid) && _prevRoom.spectatorUid !== _uid)) { currentCustomRoomId = null; isCustomRoomSpectator = false; }
                    }
                    if (currentCustomRoomId || (data.userUid && matchmaking.findRoomByUserUid(data.userUid))) {
                        socket.send(JSON.stringify({ type: 'ERROR', message: 'Sudah berada di room lain. Keluar dulu.' }));
                    } else if (data.roomId && data.playerName && data.userUid) {
                        const sanitizedName = sanitizeName(data.playerName) || 'Player';
                        const joinResult = matchmaking.joinPendingCustomRoom(data.roomId, sanitizedName, data.userUid, socket);
                        if (joinResult.success) {
                            currentPlayer = { id: joinResult.playerId, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                            currentCustomRoomId = data.roomId;
                            matchmaking.broadcastPendingCustomRoomUpdate(data.roomId);
                        } else { socket.send(JSON.stringify({ type: 'ERROR', message: joinResult.error || 'Gagal bergabung' })); }
                    } else { socket.send(JSON.stringify({ type: 'ERROR', message: 'Data tidak lengkap untuk bergabung ke room.' })); }
                    break;

                case 'START_CUSTOM_ROOM':
                    if (currentCustomRoomId) {
                        const crPending = matchmaking.getPendingCustomRoom(currentCustomRoomId);
                        if (!crPending) { socket.send(JSON.stringify({ type: 'ERROR', message: 'Room tidak ditemukan.' })); }
                        else if (crPending.hostUid !== (currentPlayer?.userUid || data.userUid)) { socket.send(JSON.stringify({ type: 'ERROR', message: 'Hanya host yang bisa memulai.' })); }
                        else { matchmaking.startCustomRoomGame(currentCustomRoomId).then(started => { if (!started) socket.send(JSON.stringify({ type: 'ERROR', message: 'Gagal memulai. Minimal 2 pemain.' })); }).catch(err => { socket.send(JSON.stringify({ type: 'ERROR', message: 'Gagal memulai custom room.' })); }); }
                    }
                    break;

                case 'LEAVE_CUSTOM_ROOM':
                    if (currentCustomRoomId) {
                        const _leavingRoom = matchmaking.getPendingCustomRoom(currentCustomRoomId);
                        const _leavingActiveRoom = matchmaking.getRoom(currentCustomRoomId);
                        if (_leavingRoom && !_leavingRoom.started) { matchmaking.leavePendingCustomRoom(currentCustomRoomId, currentPlayer?.userUid || data.userUid || '', isCustomRoomSpectator); }
                        else if (_leavingActiveRoom?.gameEngine && isCustomRoomSpectator) { _leavingActiveRoom.gameEngine.removeSpectator(socket, currentPlayer?.userUid || data.userUid || ''); }
                        currentCustomRoomId = null; isCustomRoomSpectator = false;
                    }
                    break;

                case 'KICK_FROM_ROOM':
                    if (currentCustomRoomId && currentPlayer?.userUid && data.targetUid) {
                        const kickRes = matchmaking.kickFromCustomRoom(currentCustomRoomId, data.targetUid, currentPlayer.userUid);
                        if (!kickRes.success) socket.send(JSON.stringify({ type: 'ERROR', message: kickRes.error }));
                    }
                    break;

                case 'CREATE_PARTY':
                    if (data.userUid && data.playerName && !currentPartyId) {
                        const sanitizedName = sanitizeName(data.playerName) || 'Player';
                        if (!currentPlayer) currentPlayer = { id: data.userUid, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                        matchmaking.unregisterOnline(data.userUid);
                        currentPartyId = matchmaking.createPartyLobby(data.userUid, sanitizedName, socket);
                        socket.send(JSON.stringify({ type: 'PARTY_CREATED', partyId: currentPartyId }));
                        matchmaking.broadcastPartyUpdate(currentPartyId);
                    }
                    break;

                case 'INVITE_TO_PARTY':
                    if (currentPartyId && currentPlayer?.userUid && data.targetUid) {
                        const pInvRes = matchmaking.inviteToParty(currentPartyId, currentPlayer.userUid, data.targetUid);
                        if (pInvRes.success) socket.send(JSON.stringify({ type: 'PARTY_INVITE_SENT', targetUid: data.targetUid }));
                        else socket.send(JSON.stringify({ type: 'ERROR', message: pInvRes.error }));
                    }
                    break;

                case 'PARTY_INVITE_RESPONSE':
                    if (data.inviteId && data.userUid) {
                        const pName = currentPlayer?.name || sanitizeName(data.playerName) || 'Player';
                        const pRespRes = matchmaking.respondToPartyInvite(data.inviteId, data.userUid, !!data.accepted, socket, pName);
                        if (data.accepted && pRespRes.success) {
                            currentPartyId = pRespRes.partyId;
                            if (!currentPlayer) currentPlayer = { id: data.userUid, name: pName, socket, joinTime: Date.now(), userUid: data.userUid };
                            matchmaking.unregisterOnline(data.userUid);
                            matchmaking.broadcastPartyUpdate(pRespRes.partyId);
                            socket.send(JSON.stringify({ type: 'PARTY_JOINED', partyId: pRespRes.partyId }));
                        } else if (!data.accepted) {}
                        else socket.send(JSON.stringify({ type: 'ERROR', message: pRespRes.error }));
                    }
                    break;

                case 'START_PARTY_QUEUE':
                    if (currentPartyId && currentPlayer?.userUid) {
                        const sqRes = matchmaking.startPartyQueue(currentPartyId, currentPlayer.userUid);
                        if (!sqRes.success) socket.send(JSON.stringify({ type: 'ERROR', message: sqRes.error }));
                        currentPartyId = null;
                    }
                    break;

                case 'LEAVE_PARTY':
                    if (currentPartyId && currentPlayer?.userUid) {
                        matchmaking.leavePartyLobby(currentPartyId, currentPlayer.userUid);
                        currentPartyId = null;
                        if (currentPlayer.userUid && currentPlayer.name) matchmaking.registerOnline(currentPlayer.userUid, currentPlayer.name, socket);
                    }
                    break;

                case 'REJOIN_PARTY_LOBBY':
                    if (data.userUid && data.playerName) {
                        const sanitizedName = sanitizeName(data.playerName) || 'Player';
                        if (!currentPlayer) currentPlayer = { id: data.userUid, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                        const queueingParty = matchmaking.findQueueingPartyByMember(data.userUid);
                        if (queueingParty) {
                            matchmaking.updatePartyMemberSocket(queueingParty.partyId, data.userUid, socket);
                            currentPartyId = queueingParty.partyId;
                            socket.send(JSON.stringify({ type: 'PARTY_QUEUING', sharedPartyId: queueingParty.sharedPartyId, partySize: queueingParty.partySize }));
                        } else { socket.send(JSON.stringify({ type: 'PARTY_NOT_FOUND' })); }
                    }
                    break;

                case 'REGISTER_ONLINE':
                    if (data.userUid && data.playerName) {
                        const sanitizedName = sanitizeName(data.playerName) || 'Player';
                        matchmaking.registerOnline(data.userUid, sanitizedName, socket);
                        if (!currentPlayer) currentPlayer = { id: data.userUid, name: sanitizedName, socket, joinTime: Date.now(), userUid: data.userUid };
                    }
                    break;

                case 'GET_ONLINE_PLAYERS':
                    if (data.userUid) {
                        const onlineList = matchmaking.getOnlinePlayers(data.userUid);
                        socket.send(JSON.stringify({ type: 'ONLINE_PLAYERS', players: onlineList }));
                    }
                    break;

                case 'ADD_BOT_SLOT': {
                    const crRoom = currentCustomRoomId ? matchmaking.getPendingCustomRoom(currentCustomRoomId) : null;
                    const requestingUid = currentPlayer?.userUid ?? crRoom?.hostUid;
                    if (currentCustomRoomId && requestingUid) {
                        const level = Math.min(Math.max(parseInt(data.level, 10) || 1, 1), 3);
                        const rawSlot = parseInt(data.slotPosition, 10);
                        if (isNaN(rawSlot) || rawSlot < 1 || rawSlot > 4) { socket.send(JSON.stringify({ type: 'ERROR', message: 'Posisi slot tidak valid' })); break; }
                        const addRes = matchmaking.addBotSlotToCustomRoom(currentCustomRoomId, level, requestingUid, rawSlot);
                        if (addRes.success) matchmaking.broadcastPendingCustomRoomUpdate(currentCustomRoomId);
                        else socket.send(JSON.stringify({ type: 'ERROR', message: addRes.error }));
                    }
                    break;
                }

                case 'REMOVE_BOT_SLOT': {
                    const crRoom2 = currentCustomRoomId ? matchmaking.getPendingCustomRoom(currentCustomRoomId) : null;
                    const requestingUid2 = currentPlayer?.userUid ?? crRoom2?.hostUid;
                    if (currentCustomRoomId && requestingUid2) {
                        const rawSlot2 = parseInt(data.slotPosition, 10);
                        if (isNaN(rawSlot2) || rawSlot2 < 1 || rawSlot2 > 4) { socket.send(JSON.stringify({ type: 'ERROR', message: 'Posisi slot tidak valid' })); break; }
                        const remRes = matchmaking.removeBotSlotFromCustomRoom(currentCustomRoomId, rawSlot2, requestingUid2);
                        if (remRes.success) matchmaking.broadcastPendingCustomRoomUpdate(currentCustomRoomId);
                        else socket.send(JSON.stringify({ type: 'ERROR', message: remRes.error }));
                    }
                    break;
                }

                case 'INVITE_TO_ROOM':
                    if (currentCustomRoomId && currentPlayer?.userUid && data.targetUid) {
                        const invRes = matchmaking.invitePlayerToCustomRoom(currentCustomRoomId, currentPlayer.userUid, data.targetUid);
                        if (invRes.success) socket.send(JSON.stringify({ type: 'INVITE_SENT', targetUid: data.targetUid }));
                        else socket.send(JSON.stringify({ type: 'ERROR', message: invRes.error }));
                    }
                    break;

                case 'INVITE_RESPONSE':
                    if (data.inviteId && data.userUid) {
                        const pName = currentPlayer?.name || sanitizeName(data.playerName) || 'Player';
                        const respRes = matchmaking.respondToInvite(data.inviteId, data.userUid, !!data.accepted, socket, pName);
                        if (data.accepted && respRes.success) {
                            currentPlayer = { id: respRes.playerId, name: pName, socket, joinTime: Date.now(), userUid: data.userUid };
                            currentCustomRoomId = respRes.roomId;
                            matchmaking.unregisterOnline(data.userUid);
                            matchmaking.broadcastPendingCustomRoomUpdate(respRes.roomId);
                            socket.send(JSON.stringify({ type: 'INVITE_ACCEPTED', roomId: respRes.roomId, playerId: respRes.playerId }));
                        } else if (!data.accepted) {}
                        else socket.send(JSON.stringify({ type: 'ERROR', message: respRes.error }));
                    }
                    break;

                case 'CLIENT_PING':
                    try { socket.send(JSON.stringify({ type: 'SERVER_PONG', ts: data.ts })); } catch(e) {}
                    break;

                case 'REPORT_PING':
                    if (currentPlayer && data.roomId) {
                        const room = matchmaking.getRoom(data.roomId);
                        if (room) {
                            const rp = room.players.find(p => p.id === currentPlayer.id);
                            if (rp) rp.ping = typeof data.ping === 'number' ? data.ping : null;
                            const pings = room.players.map(p => ({ id: p.id, name: p.name, ping: p.ping ?? null }));
                            room.gameEngine.broadcastToAll({ type: 'PING_DATA', pings });
                        }
                    }
                    break;

                default:
                    console.log(`❓ Unknown: ${data.type}`);
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }
    });

    socket.on('close', () => {
        clearInterval(pingInterval);
        console.log(`🔌 Disconnected: ${currentPlayer?.name || 'unknown'}`);

        if (currentCustomRoomId) {
            const pendingRoom = matchmaking.getPendingCustomRoom(currentCustomRoomId);
            const activeRoom = matchmaking.getRoom(currentCustomRoomId);
            if (pendingRoom && !pendingRoom.started) { matchmaking.leavePendingCustomRoom(currentCustomRoomId, currentPlayer?.userUid || '', isCustomRoomSpectator); }
            else if (activeRoom?.gameEngine) {
                if (isCustomRoomSpectator) {
                    activeRoom.gameEngine.removeSpectator(socket, currentPlayer?.userUid || '');
                    currentCustomRoomId = null; isCustomRoomSpectator = false;
                } else if (currentPlayer && activeRoom.gameEngine.isCustomRoom) {
                    const _capturedPlayerId = currentPlayer.id;
                    // [FIX RECONNECT TANPA BATAS] Hapus timer markPlayerLeft untuk custom room.
                    // Pemain custom match boleh reconnect kapan saja selagi match belum di-cleanup
                    // (gs.gameOver = false), sama seperti ranked mode.
                    // markPlayerLeft HANYA dipanggil jika pemain menekan tombol "Kembali ke Home"
                    // secara sukarela (handler LEAVE_MATCH), bukan karena disconnect.
                    // Cancel timer lama jika masih ada (misal dari disconnect sebelumnya)
                    if (pendingCustomMarkLeftTimers.has(_capturedPlayerId)) {
                        clearTimeout(pendingCustomMarkLeftTimers.get(_capturedPlayerId));
                        pendingCustomMarkLeftTimers.delete(_capturedPlayerId);
                    }
                    // Tidak membuat timer baru — pemain bebas reconnect tanpa batas waktu
                }
            }
        }

        if (currentPartyId && currentPlayer?.userUid) { matchmaking.leavePartyLobby(currentPartyId, currentPlayer.userUid); currentPartyId = null; }

        if (currentPlayer) {
            if (currentPlayer.userUid) matchmaking.unregisterOnline(currentPlayer.userUid);
            matchmaking.removePlayer(currentPlayer.id);
            const capturedId = currentPlayer.id;
            const autoTimer = setTimeout(() => { pendingAutoModeTimers.delete(capturedId); matchmaking.setPlayerAutoModeInAllRooms(capturedId, true); }, 60000); // [FIX] 5s→60s: beri waktu reconnect tanpa batas selagi pertandingan aktif
            pendingAutoModeTimers.set(capturedId, autoTimer);
        }
    });

    socket.on('error', (e) => { clearInterval(pingInterval); console.error("❌ WS Error:", e); });
});

// =============================================
// STATE PERSISTENCE (survive Railway restarts)
// =============================================
const STATE_FILE = path.join(process.env.STATE_DIR || '/tmp', 'game_state_snapshot.json');
const SNAPSHOT_INTERVAL_MS = 10_000; // simpan setiap 10 detik

/** Serialize semua room aktif ke plain object (tanpa socket) */
function serializeRooms() {
    const out = {};
    for (const [roomId, room] of matchmaking.rooms) {
        if (room.status === 'finished') continue; // skip yg sudah selesai
        const ge = room.gameEngine;
        try {
            out[roomId] = {
                status: room.status,
                createdAt: room.createdAt,
                isCustomRoom: ge.isCustomRoom,
                hostUserUid: ge.hostUserUid,
                selectedProvinces: ge.selectedProvinces,
                spectatorUserUids: ge.spectatorUserUids,
                gs: {
                    round: ge.gs.round,
                    phase: ge.gs.phase,
                    // [FIX] phase1Player biasanya string/null, tapi jaga-jaga jika object
                    phase1Player: (ge.gs.phase1Player && typeof ge.gs.phase1Player === 'object')
                        ? ge.gs.phase1Player.id : ge.gs.phase1Player,
                    currentProvince: ge.gs.currentProvince,
                    topCard: ge.gs.topCard,
                    drawPile: ge.gs.drawPile,
                    discardPile: ge.gs.discardPile,
                    forcePickMode: ge.gs.forcePickMode,
                    forcePickPlayers: ge.gs.forcePickPlayers.map(p => ({ id: p.id })),
                    forcePickProcessing: ge.gs.forcePickProcessing,
                    isHandlingForcePick: ge.gs.isHandlingForcePick,
                    isEndingRound: ge.gs.isEndingRound,
                    isStartingPhase: ge.gs.isStartingPhase,
                    // [FIX] Sanitize currentRoundPlays — ambil field plain saja
                    currentRoundPlays: (ge.gs.currentRoundPlays || []).map(r => ({
                        playerId: r.playerId, playerName: r.playerName,
                        card: r.card, power: r.power, isDraw: r.isDraw ?? false
                    })),
                    roundHistory: ge.gs.roundHistory,
                    winners: ge.gs.winners.map(p => ({ id: p.id, name: p.name, rank: p.rank })),
                    gameOver: ge.gs.gameOver,
                    surrenderCount: ge.gs.surrenderCount,
                    // [FIX CIRCULAR] drawTurnQueue berisi referensi penuh ke player objects
                    // yang punya afkTimer (Timeout) → circular reference → JSON.stringify gagal.
                    // Simpan hanya id, restore akan resolve ke player object saat restart.
                    drawTurnQueue: (ge.gs.drawTurnQueue || []).map(p =>
                        typeof p === 'object' && p !== null ? { id: p.id } : { id: p }
                    ),
                    drawTurnIndex: ge.gs.drawTurnIndex,
                    isPaused: ge.gs.isPaused,
                    players: ge.gs.players.map(p => ({
                        id: p.id, name: p.name, isBot: p.isBot,
                        userUid: p.userUid, hand: p.hand,
                        totalPower: p.totalPower, hasPlayed: p.hasPlayed,
                        mustDraw: p.mustDraw, mustForcePick: p.mustForcePick,
                        freed: p.freed, winner: p.winner, rank: p.rank,
                        autoMode: true, // semua auto setelah restart
                        leftMatch: p.leftMatch, statsSaved: p.statsSaved,
                        botLevel: p.botLevel, drawLevel: p.drawLevel ?? 1,
                        drawCount: p.drawCount ?? 0, drawProb: p.drawProb ?? 0,
                        mustPlayMatching: p.mustPlayMatching ?? false,
                        drawOnceNoMatch: p.drawOnceNoMatch ?? false
                        // [FIX] afkTimer (Timeout) tidak disimpan — akan di-reset saat restore
                    }))
                }
            };
        } catch (e) {
            console.warn(`⚠️ Gagal serialize room ${roomId}:`, e.message);
        }
    }
    return out;
}

/** Simpan snapshot ke disk */
function saveSnapshot() {
    try {
        const data = { savedAt: Date.now(), rooms: serializeRooms() };
        fs.writeFileSync(STATE_FILE, JSON.stringify(data), 'utf8');
    } catch (e) {
        console.warn('⚠️ Gagal simpan snapshot:', e.message);
    }
}

/** Restore room dari snapshot setelah restart */
function restoreSnapshot() {
    try {
        if (!fs.existsSync(STATE_FILE)) return;
        const raw = fs.readFileSync(STATE_FILE, 'utf8');
        const data = JSON.parse(raw);
        // Jangan restore snapshot yang lebih dari 2 jam (room sudah kedaluwarsa)
        if (!data.savedAt || (Date.now() - data.savedAt) > 2 * 60 * 60 * 1000) {
            console.log('🗑️ Snapshot kedaluwarsa, dilewati.');
            fs.unlinkSync(STATE_FILE);
            return;
        }
        const rooms = data.rooms || {};
        let restored = 0;
        for (const [roomId, snap] of Object.entries(rooms)) {
            try {
                if (snap.gs.gameOver) continue;
                const ge = new GameEngine(roomId);
                ge.isCustomRoom = snap.isCustomRoom ?? false;
                ge.hostUserUid = snap.hostUserUid ?? null;
                ge.selectedProvinces = snap.selectedProvinces ?? [];
                ge.spectatorUserUids = snap.spectatorUserUids ?? [];
                // Restore gs
                ge.gs.round = snap.gs.round;
                ge.gs.phase = snap.gs.phase;
                ge.gs.phase1Player = snap.gs.phase1Player;
                ge.gs.currentProvince = snap.gs.currentProvince;
                ge.gs.topCard = snap.gs.topCard;
                ge.gs.drawPile = snap.gs.drawPile;
                ge.gs.discardPile = snap.gs.discardPile;
                ge.gs.forcePickMode = snap.gs.forcePickMode;
                ge.gs.forcePickProcessing = snap.gs.forcePickProcessing;
                ge.gs.isHandlingForcePick = snap.gs.isHandlingForcePick;
                ge.gs.isEndingRound = snap.gs.isEndingRound;
                ge.gs.isStartingPhase = snap.gs.isStartingPhase;
                ge.gs.currentRoundPlays = snap.gs.currentRoundPlays;
                ge.gs.roundHistory = snap.gs.roundHistory;
                ge.gs.gameOver = snap.gs.gameOver;
                ge.gs.surrenderCount = snap.gs.surrenderCount ?? 0;
                ge.gs.drawTurnIndex = snap.gs.drawTurnIndex ?? 0;
                ge.gs.isPaused = snap.gs.isPaused ?? false;
                ge.gs.winners = snap.gs.winners ?? [];
                ge.gs.forcePickPlayers = (snap.gs.forcePickPlayers ?? []).map(fp => {
                    const found = snap.gs.players.find(p => p.id === fp.id);
                    return found ? { ...found, socket: null } : fp;
                });
                // Restore players (tanpa socket, semua autoMode=true)
                ge.gs.players = snap.gs.players.map(p => ({
                    ...p, socket: null, autoMode: true,
                    isProcessingAction: false
                }));
                // [FIX] drawTurnQueue di-simpan sebagai [{id}] — resolve kembali ke player objects
                ge.gs.drawTurnQueue = (snap.gs.drawTurnQueue ?? []).map(entry => {
                    const pid = typeof entry === 'object' ? entry.id : entry;
                    return ge.gs.players.find(p => p.id === pid) ?? { id: pid };
                });
                const room = {
                    id: roomId, status: snap.status,
                    createdAt: snap.createdAt,
                    gameEngine: ge,
                    players: snap.gs.players
                        .filter(p => !p.isBot)
                        .map(p => ({ id: p.id, name: p.name, socket: null, userUid: p.userUid }))
                };
                matchmaking.rooms.set(roomId, room);
                restored++;
                console.log(`♻️  Room ${roomId} di-restore (${snap.gs.players.filter(p=>!p.isBot).length} pemain manusia)`);
            } catch (e) {
                console.warn(`⚠️ Gagal restore room ${roomId}:`, e.message);
            }
        }
        if (restored > 0) console.log(`✅ ${restored} room berhasil di-restore dari snapshot.`);
        // Hapus snapshot setelah restore agar tidak restore ulang
        fs.unlinkSync(STATE_FILE);
    } catch (e) {
        console.warn('⚠️ Gagal baca snapshot:', e.message);
    }
}

/** Graceful shutdown: simpan state lalu tutup koneksi */
async function gracefulShutdown(signal) {
    console.log(`\n🛑 ${signal} diterima — graceful shutdown dimulai...`);
    // 1. Simpan state dulu sebelum apapun
    saveSnapshot();
    console.log('💾 Snapshot tersimpan.');
    // 2. Tutup WebSocket server (hentikan koneksi baru)
    wss.close(() => console.log('🔌 WebSocket server ditutup.'));
    // 3. Tutup HTTP server
    server.close(() => {
        console.log('🌐 HTTP server ditutup. Proses selesai.');
        process.exit(0);
    });
    // Force exit setelah 5 detik jika masih ada yang menggantung
    setTimeout(() => { console.log('⏱️ Force exit.'); process.exit(0); }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// Restore state dari snapshot (jika ada) sebelum server mulai menerima koneksi
restoreSnapshot();

// Simpan snapshot secara berkala
setInterval(saveSnapshot, SNAPSHOT_INTERVAL_MS);

const PORT = parseInt(process.env.PORT || '8000');
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`📊 Stats: http://localhost:${PORT}/stats`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
