// ===== 1) Seçiciler =====
const form = document.getElementById("form");
const input = document.getElementById("gorevInput");
const oncelikSec = document.getElementById("oncelikSec");
const liste = document.getElementById("liste");
const sayac = document.getElementById("sayac");
const uyari = document.getElementById("uyari");
const logAlani = document.getElementById("log");
const temizleBtn = document.getElementById("temizleBtn");

// ===== 2) Veri =====
let gorevler = [];
let adimNo = 0;

// ===== 3) Fonksiyonlar =====
function logYaz(mesaj) {
  adimNo++;
  const li = document.createElement("li");
  li.textContent = adimNo + ". " + mesaj;
  logAlani.prepend(li);
}

function uyariGoster(mesaj) {
  uyari.textContent = mesaj;
  input.focus();
}

function rozetRengi(oncelik) {
  if (oncelik === "Yüksek") return "text-bg-danger";
  if (oncelik === "Orta") return "text-bg-warning";
  return "text-bg-success";
}

function gorevTamamla(i) {
  logYaz("gorevTamamla(" + i + ") çalıştı");
  gorevler[i].bitti = !gorevler[i].bitti;
  logYaz('"' + gorevler[i].metin + '" için bitti = ' + gorevler[i].bitti);
  listeyiCiz();
}

function gorevSil(i) {
  logYaz("gorevSil(" + i + ") çalıştı");
  const silinen = gorevler.splice(i, 1);
  logYaz('"' + silinen[0].metin + '" diziden silindi');
  listeyiCiz();
}

function tamamlananlariTemizle() {
  logYaz("tamamlananlariTemizle() çalıştı");
  gorevler = gorevler.filter(function (g) {
    return g.bitti === false;
  });
  logYaz("Kalan görev sayısı: " + gorevler.length);
  listeyiCiz();
}

function gorevKartiOlustur(g, i) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex align-items-center gap-2" + (g.bitti ? " gorev-bitti" : "");

  const metin = document.createElement("span");
  metin.className = "metin flex-grow-1";
  metin.textContent = g.metin;

  const rozet = document.createElement("span");
  rozet.className = "badge " + rozetRengi(g.oncelik);
  rozet.textContent = g.oncelik;

  const tamam = document.createElement("button");
  tamam.className = "btn btn-sm btn-outline-primary";
  tamam.textContent = g.bitti ? "Geri al" : "Tamamla";
  tamam.addEventListener("click", function () {
    gorevTamamla(i);
  });

  const sil = document.createElement("button");
  sil.className = "btn btn-sm btn-outline-danger";
  sil.textContent = "Sil";
  sil.addEventListener("click", function () {
    gorevSil(i);
  });

  li.append(metin, rozet, tamam, sil);
  liste.appendChild(li);
}

function listeyiCiz() {
  logYaz("listeyiCiz() çalıştı");
  liste.innerHTML = "";

  if (gorevler.length === 0) {
    const bos = document.createElement("li");
    bos.className = "bos";
    bos.textContent = "Henüz görev yok. Yukarıya bir görev yaz ve Ekle’ye bas.";
    liste.appendChild(bos);
  }

  gorevler.forEach(gorevKartiOlustur);
  logYaz(gorevler.length + " görev kartı çizildi");
  sayaciGuncelle();
}

function sayaciGuncelle() {
  const biten = gorevler.filter(function (g) {
    return g.bitti === true;
  }).length;
  sayac.textContent = gorevler.length + " görev, " + biten + " tamamlandı";
}

function gorevEkle() {
  logYaz("gorevEkle() çalıştı");
  const metin = input.value.trim();
  logYaz('Kutudaki yazı alındı: "' + metin + '"');

  if (metin === "") {
    logYaz("Yazı boş, görev eklenmedi");
    uyariGoster("Görev boş olamaz. Önce bir şey yaz.");
    return;
  }

  uyari.textContent = "";
  const oncelik = oncelikSec.value;
  gorevler.push({ metin: metin, oncelik: oncelik, bitti: false });
  logYaz("Görev diziye eklendi. Toplam görev: " + gorevler.length);
  listeyiCiz();

  input.value = "";
  input.focus();
}

// ===== 4) Olaylar =====
form.addEventListener("submit", function (e) {
  e.preventDefault();
  gorevEkle();
});
temizleBtn.addEventListener("click", tamamlananlariTemizle);

// ===== 5) Başlangıç =====
listeyiCiz();