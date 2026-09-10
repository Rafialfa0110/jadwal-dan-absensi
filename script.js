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
            "❌ Mata kuliah tidak memiliki jadwal hari ini.";

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
            "⏰ Absensi belum dibuka atau sudah ditutup.";

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
            "⚠️ Kamu sudah melakukan absensi hari ini.";

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
        "✅ Absensi berhasil dicatat!";


    tampilkanRiwayat();
}


// ==============================
// FUNGSI RIWAYAT
// ==============================

function tampilkanRiwayat() {

    let riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];


    const container =
        document.getElementById("riwayat");


    if (!container) {
        return;
    }


    if (riwayat.length === 0) {

        container.innerHTML =
            "<p>Belum ada data absensi.</p>";

        return;
    }


    container.innerHTML = "";


    riwayat.forEach(function(data) {

        container.innerHTML += `

            <div class="absen-item">

                <strong>
                    ${data.mataKuliah}
                </strong>

                <p>
                    📅 ${data.tanggal}
                </p>

                <p>
                    ⏰ ${data.waktu}
                </p>

                <p>
                    ✅ ${data.status}
                </p>

            </div>

        `;

    });

}


// ==============================
// DATA JADWAL KULIAH
// ==============================

const jadwalKuliah = {

    Senin: [
        {
            mataKuliah: "Mobile Computing",
            jam: "08.00 - 09.40",
            ruang: "Lab A"
        }
    ],

    Selasa: [
        {
            mataKuliah: "Basis Data",
            jam: "10.00 - 11.40",
            ruang: "Ruang B102"
        }
    ],

    Rabu: [
        {
            mataKuliah: "Pemrograman Web",
            jam: "08.00 - 09.40",
            ruang: "Lab Komputer"
        }
    ],

    Kamis: [
        {
            mataKuliah: "Sistem Operasi",
            jam: "13.00 - 14.40",
            ruang: "Ruang C201"
        }
    ],

    Jumat: [
        {
            mataKuliah: "Jaringan Komputer",
            jam: "08.00 - 09.40",
            ruang: "Lab Jaringan"
        }
    ]

};


// ==============================
// JADWAL HARI INI
// ==============================

function tampilkanJadwalHariIni() {

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
        namaHari[new Date().getDay()];

    const container =
        document.getElementById("jadwalHariIni");

    if (!container) {
        return;
    }

    const dataJadwal = ambilJadwal();

    const jadwalHariIni =
        dataJadwal.filter(function(data) {

            return data.hari === hariSekarang;

        });

    if (jadwalHariIni.length === 0) {

        container.innerHTML =
            `<p>🎉 Tidak ada jadwal kuliah hari ini.</p>`;

        return;
    }

    container.innerHTML = "";

    // Ambil data absensi
    const riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];

    jadwalHariIni.forEach(function(data) {

        // Cek apakah sudah absen
        const sudahAbsen =
            riwayat.some(function(absen) {

                return (
                    absen.mataKuliah === data.mataKuliah &&
                    absen.tanggal ===
                    new Date().toLocaleDateString("id-ID")
                );

            });

        const status =
            sudahAbsen
            ? "🟢 Sudah Hadir"
            : "🟡 Belum Absen";

        container.innerHTML += `

            <div class="jadwal">

                <h3>📚 ${data.mataKuliah}</h3>

                <p>
                    ⏰ ${data.mulai} - ${data.selesai}
                </p>

                <p>
                    🏫 ${data.ruang}
                </p>

                <p>
                    <strong>${status}</strong>
                </p>

            </div>

        `;

    });

}

function ambilJadwal() {

    let data;

    try {
        data = JSON.parse(
            localStorage.getItem("dataJadwal")
        );
    } catch (error) {
        data = null;
    }

    if (!Array.isArray(data) || data.length === 0) {

        data = [
            {
                id: 1,
                mataKuliah: "Mobile Computing",
                hari: "Senin",
                mulai: "08:00",
                selesai: "09:40",
                ruang: "Lab A"
            },
            {
                id: 2,
                mataKuliah: "Basis Data",
                hari: "Selasa",
                mulai: "10:00",
                selesai: "11:40",
                ruang: "Ruang B102"
            },
            {
                id: 3,
                mataKuliah: "Pemrograman Web",
                hari: "Rabu",
                mulai: "08:00",
                selesai: "09:40",
                ruang: "Lab Komputer"
            },
            {
                id: 4,
                mataKuliah: "Sistem Operasi",
                hari: "Kamis",
                mulai: "13:00",
                selesai: "14:40",
                ruang: "Ruang C201"
            },
            {
                id: 5,
                mataKuliah: "Jaringan Komputer",
                hari: "Jumat",
                mulai: "08:00",
                selesai: "09:40",
                ruang: "Lab Jaringan"
            }
        ];

        localStorage.setItem(
            "dataJadwal",
            JSON.stringify(data)
        );
    }

    return data;
}

// ==============================
// UPDATE PILIHAN MATA KULIAH
// ==============================

function tampilkanPilihanMataKuliah() {

    const select =
        document.getElementById("mataKuliah");

    if (!select) {
        return;
    }

    const dataJadwal = ambilJadwal();

    // Mengambil nama mata kuliah tanpa duplikat
    const daftarMataKuliah = [];

    dataJadwal.forEach(function(data) {

        if (!daftarMataKuliah.includes(data.mataKuliah)) {
            daftarMataKuliah.push(data.mataKuliah);
        }

    });


    select.innerHTML = "";


    if (daftarMataKuliah.length === 0) {

        select.innerHTML =
            '<option value="">Belum ada jadwal</option>';

        return;
    }


    daftarMataKuliah.forEach(function(mataKuliah) {

        const option =
            document.createElement("option");

        option.value = mataKuliah;

        option.textContent = mataKuliah;

        select.appendChild(option);

    });

}
tampilkanPilihanMataKuliah();
// ==============================
// TAMBAH JADWAL
// ==============================

function tambahJadwal() {

    const mataKuliah =
        document.getElementById("namaMataKuliah").value;

    const hari =
        document.getElementById("hariJadwal").value;

    const mulai =
        document.getElementById("jamMulai").value;

    const selesai =
        document.getElementById("jamSelesai").value;

    const ruang =
        document.getElementById("ruangan").value;


    // Cek apakah semua sudah diisi
    if (
        mataKuliah === "" ||
        mulai === "" ||
        selesai === "" ||
        ruang === ""
    ) {

        alert("⚠️ Semua data jadwal harus diisi.");

        return;
    }


    // Ambil jadwal lama
    let dataJadwal = ambilJadwal();


    // Buat ID baru
    const idBaru =
        dataJadwal.length > 0
        ? Math.max(...dataJadwal.map(data => data.id)) + 1
        : 1;


    // Buat data jadwal baru
    const jadwalBaru = {

        id: idBaru,

        mataKuliah: mataKuliah,

        hari: hari,

        mulai: mulai,

        selesai: selesai,

        ruang: ruang

    };


    // Tambahkan ke data
    dataJadwal.push(jadwalBaru);


    // Simpan ke Local Storage
    localStorage.setItem(
        "dataJadwal",
        JSON.stringify(dataJadwal)
    );


    // Tampilkan kembali data
    tampilkanDaftarJadwal();

    tampilkanJadwalHariIni();

    tampilkanPilihanMataKuliah();


    // Kosongkan form
    document.getElementById("namaMataKuliah").value = "";

    document.getElementById("jamMulai").value = "";

    document.getElementById("jamSelesai").value = "";

    document.getElementById("ruangan").value = "";


    alert("✅ Jadwal berhasil ditambahkan!");
}

// ==============================
// TAMPILKAN DAFTAR JADWAL
// ==============================

function tampilkanDaftarJadwal() {

    const container =
        document.getElementById("daftarJadwal");

    if (!container) {
        return;
    }

    const dataJadwal = ambilJadwal();

    container.innerHTML = "";

    dataJadwal.forEach(function(data) {

        container.innerHTML += `

            <div class="jadwal-item">

                <h3>📚 ${data.mataKuliah}</h3>

                <p>📅 ${data.hari}</p>

                <p>⏰ ${data.mulai} - ${data.selesai}</p>

                <p>🏫 ${data.ruang}</p>

                <button
                    class="hapus-jadwal"
                    onclick="hapusJadwal(${data.id})">
                    🗑️ Hapus
                </button>

            </div>

        `;

    });
}



// ==============================
// HAPUS JADWAL
// ==============================

function hapusJadwal(id) {

    let dataJadwal = ambilJadwal();

    dataJadwal = dataJadwal.filter(function(data) {
        return data.id !== id;
    });

    localStorage.setItem(
        "dataJadwal",
        JSON.stringify(dataJadwal)
    );

    tampilkanDaftarJadwal();
    tampilkanJadwalHariIni();
    tampilkanPilihanMataKuliah();

    alert("🗑️ Jadwal berhasil dihapus.");
}

tampilkanDaftarJadwal();
tampilkanJadwalHariIni();
tampilkanPilihanMataKuliah();

// ==============================
// RINGKASAN ABSENSI
// ==============================

function tampilkanRingkasan() {

    const dataJadwal = ambilJadwal();

    const riwayat =
        JSON.parse(
            localStorage.getItem("riwayatAbsensi")
        ) || [];

    const totalJadwal =
        document.getElementById("totalJadwal");

    const sudahHadir =
        document.getElementById("sudahHadir");

    const belumAbsen =
        document.getElementById("belumAbsen");

    const jumlahIzin =
        document.getElementById("jumlahIzin");

    const jumlahSakit =
        document.getElementById("jumlahSakit");

    const jumlahAlpa =
        document.getElementById("jumlahAlpa");
    
const persentaseKehadiran =
    document.getElementById("persentaseKehadiran");
    
    if (!totalJadwal || !sudahHadir || !belumAbsen) {
        return;
    }

    const hadir = riwayat.filter(
        data => data.status === "Hadir"
    ).length;

    const izin = riwayat.filter(
        data => data.status === "Izin"
    ).length;

    const sakit = riwayat.filter(
        data => data.status === "Sakit"
    ).length;

    const alpa = riwayat.filter(
        data => data.status === "Alpa"
    ).length;

    totalJadwal.textContent =
        dataJadwal.length;

    sudahHadir.textContent =
        hadir;

    belumAbsen.textContent =
        Math.max(
            dataJadwal.length - riwayat.length,
            0
        );

    if (jumlahIzin) {
        jumlahIzin.textContent = izin;
    }

    if (jumlahSakit) {
        jumlahSakit.textContent = sakit;
    }

    if (jumlahAlpa) {
        jumlahAlpa.textContent = alpa;
    }
    if (persentaseKehadiran) {
    const persentase =
        dataJadwal.length > 0
            ? (hadir / dataJadwal.length) * 100
            : 0;

    persentaseKehadiran.textContent =
        persentase.toFixed(1) + "%";
  }
}
tampilkanRingkasan();
// ==============================
// LOGIN MAHASISWA
// ==============================

function loginMahasiswa() {

    const inputNama = document.getElementById("namaLogin");
    const inputNim = document.getElementById("nimLogin");

    const loginHalaman = document.getElementById("loginHalaman");
    const beranda = document.getElementById("beranda");

    // Pastikan elemen login ditemukan
    if (!inputNama || !inputNim || !loginHalaman || !beranda) {
        alert("❌ Terjadi kesalahan pada halaman login.");
        return;
    }

    const nama = inputNama.value.trim();
    const nim = inputNim.value.trim();

    // Cek input
    if (nama === "" || nim === "") {
        alert("⚠️ Nama mahasiswa dan NIM harus diisi!");
        return;
    }

    // Simpan data login
    localStorage.setItem("namaMahasiswa", nama);
    localStorage.setItem("nimMahasiswa", nim);

    // Tutup halaman login
    loginHalaman.classList.remove("aktif");

    // Buka halaman beranda
    beranda.classList.add("aktif");

    // Update profil
    const profil = document.querySelector(".profil");

    if (profil) {

        const judulProfil = profil.querySelector("h2");

        if (judulProfil) {
            judulProfil.textContent = "👋 Halo, " + nama;
        }

        const dataProfil = profil.querySelectorAll("p");

        if (dataProfil.length > 0) {
            dataProfil[0].innerHTML =
                "<strong>NIM:</strong> " + nim;
        }
    }

    // Update header
    const headerText = document.querySelector("header p");

    if (headerText) {
        headerText.textContent =
            "Selamat datang, " + nama + " 👋";
    }

    // Update data beranda
    tampilkanRingkasan();
    tampilkanJadwalHariIni();

    console.log("Login berhasil:", nama, nim);
}
// ==============================
// LOGOUT MAHASISWA
// ==============================

function logoutMahasiswa() {

    // Hapus data login
    localStorage.removeItem("namaMahasiswa");
    localStorage.removeItem("nimMahasiswa");

    // Sembunyikan Beranda
    document.getElementById("beranda").classList.remove("aktif");

    // Tampilkan halaman login
    document.getElementById("loginHalaman").classList.add("aktif");

    // Kosongkan input login
    document.getElementById("namaLogin").value = "";
    document.getElementById("nimLogin").value = "";
}
function tampilkanTanggalHariIni() {
    const tanggal = new Date();

    const pilihan = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const tanggalElement =
        document.getElementById("tanggalHariIni");

    if (tanggalElement) {
        tanggalElement.textContent =
            tanggal.toLocaleDateString("id-ID", pilihan);
    }
}

function tampilkanTanggalHariIni() {
    const tanggal = new Date();

    const pilihan = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const tanggalElement =
        document.getElementById("tanggalHariIni");

    if (tanggalElement) {
        tanggalElement.textContent =
            tanggal.toLocaleDateString("id-ID", pilihan);
    }
}

tampilkanTanggalHariIni();
