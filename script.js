// ==============================
// LUCIDE ICONS
// ==============================
function refreshIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}


// ==============================
// PINDAH HALAMAN
// ==============================
function bukaHalaman(namaHalaman) {

    const semuaHalaman = document.querySelectorAll(".halaman");

    semuaHalaman.forEach(function(halaman) {
        halaman.classList.remove("aktif");
    });

    const halamanTujuan = document.getElementById(namaHalaman);

    if (halamanTujuan) {
        halamanTujuan.classList.add("aktif");
    }

    // Tampilkan riwayat saat membuka halaman Riwayat
    if (namaHalaman === "riwayatHalaman") {
        tampilkanRiwayat();
    }

    refreshIcons();
}


// ==============================
// FUNGSI ABSENSI
// ==============================
function absen() {

    const mataKuliah =
        document.getElementById("mataKuliah").value;

    const sekarang = new Date();

    const namaHari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const hariSekarang =
        namaHari[sekarang.getDay()];

    const jamSekarang =
        sekarang.getHours() * 60 +
        sekarang.getMinutes();


    // Ambil jadwal yang tersimpan
    const dataJadwal = ambilJadwal();


    // Cari jadwal mata kuliah hari ini
    const jadwal = dataJadwal.find(function(data) {

        return (
            data.mataKuliah === mataKuliah &&
            data.hari === hariSekarang
        );

    });


    // Kalau tidak ada jadwal hari ini
    if (!jadwal) {

        document.getElementById("hasilAbsensi").innerHTML =
            "Mata kuliah tidak memiliki jadwal hari ini.";

        return;
    }


    // Ubah jam menjadi menit
    const waktuMulai =
        jadwal.mulai.split(":");

    const waktuSelesai =
        jadwal.selesai.split(":");


    const mulai =
        parseInt(waktuMulai[0]) * 60 +
        parseInt(waktuMulai[1]);


    const selesai =
        parseInt(waktuSelesai[0]) * 60 +
        parseInt(waktuSelesai[1]);


    // Cek waktu absensi
    if (
        jamSekarang < mulai ||
        jamSekarang > selesai
    ) {

        document.getElementById("hasilAbsensi").innerHTML =
            "Absensi belum dibuka atau sudah ditutup.";

        return;
    }


    // Ambil riwayat
    let riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];


    const tanggal =
        sekarang.toLocaleDateString("id-ID");


    // Cek apakah sudah absen
    const sudahAbsen =
        riwayat.some(function(data) {

            return (
                data.mataKuliah === mataKuliah &&
                data.tanggal === tanggal
            );

        });


    if (sudahAbsen) {

        document.getElementById("hasilAbsensi").innerHTML =
            "Kamu sudah melakukan absensi hari ini.";

        return;
    }


    // Waktu absensi
    const waktu =
        sekarang.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // Data absensi
    const dataAbsensi = {
        mataKuliah: mataKuliah,
        tanggal: tanggal,
        waktu: waktu,
        status: document.getElementById("statusAbsensi").value
    };


    // Simpan
    riwayat.push(dataAbsensi);

    localStorage.setItem(
        "riwayatAbsensi",
        JSON.stringify(riwayat)
    );


    document.getElementById("hasilAbsensi").innerHTML =
        "Absensi berhasil dicatat!";


    // Update tampilan secara langsung
    tampilkanRiwayat();
    tampilkanJadwalHariIni();
    tampilkanRingkasan();

    refreshIcons();
}
