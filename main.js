const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan elemen-elemen HTML yang diperlukan
  const inputBook = document.getElementById("form");
  const bookSubmit = document.getElementById("book-Submit");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  // Membuat array untuk menyimpan daftar buku
  let books = [];
  let initialBooks = [];

  // Memeriksa apakah ada data buku di localStorage
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    initialBooks = [...books];
  }
  // Fungsi untuk menyimpan data buku ke localStorage
  function saveBookToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function triggerSavedEvent() {
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
  // Event Listener submit form untuk menambahkan buku
  inputBook.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputBookTitle = document.getElementById("input_title").value;
    const inputBookAuthor = document.getElementById("input_author").value;
    const inputBookYear = Number(document.getElementById("input_year").value);
    const inputBookIsComplete =
      document.getElementById("inputBookCheckbox").checked;

    // Memeriksa apakah buku dengan judul yang sama sudah ada
    const isDuplicate = books.some((book) => book.title === inputBookTitle);

    if (isDuplicate) {
      alert("Buku yang anda inputkan sudah ada di dalam daftar.");
      document.getElementById("input_title").value = "";
      document.getElementById("input_author").value = "";
      document.getElementById("input_year").value = "";
      document.getElementById("inputBookCheckbox").checked = false;
    } else {
      // Membuat objek buku baru
      alert("Buku Ditambahkan ke Daftar Bookshelf.");
      const book = {
        id: new Date().getTime(),
        title: inputBookTitle,
        author: inputBookAuthor,
        year: inputBookYear,
        isComplete: inputBookIsComplete,
      };

      // Menambahkan buku ke daftar dan menyimpan ke localStorage
      books.push(book);
      saveBookToStorage();
      triggerSavedEvent();
      updateBookshelf();

      // Mengosongkan input form setelah menambahkan buku
      document.getElementById("input_title").value = "";
      document.getElementById("input_author").value = "";
      document.getElementById("input_year").value = "";
      document.getElementById("inputBookCheckbox").checked = false;
    }
  });

  // Fungsi untuk menghapus buku berdasarkan ID
  function removeBookItem(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      saveBookToStorage();
      updateBookshelf();
    }
  }

  // Fungsi untuk mengganti status selesai atau belum selesai membaca buku
  function toggleIsComplete(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveBookToStorage();
      updateBookshelf();
    }
  }
  
  // Memperbarui tampilan rak buku
  function updateBookshelf() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of books) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  // Menghandle submit form untuk pencarian buku
  const searchBook = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");

  searchBook.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchBookTitle.value.toLowerCase().trim();

    const searchTheResults = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
      );
    });
    updateSearchTheResults(searchTheResults);
  });
  searchBookTitle.addEventListener("blur", function () {
    // Kembalikan data ke kondisi awal
    searchBookTitle.value = "";
    updateSearchTheResults(initialBooks);
  });
  // Fungsi untuk memperbarui tampilan hasil pencarian
  function updateSearchTheResults(results) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of results) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  // Fungsi untuk membuat elemen buku dalam daftar
  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.className = "book_item";
    bookItem.style.margin = "10px";

    const actionButtons = document.createElement("div");
    actionButtons.className = "action";

    const title = document.createElement("h3");
    title.textContent = book.title;
    title.style.color = "black";
    title.style.marginBottom = "10px";

    const author = document.createElement("p");
    author.textContent = "Penulis: " + book.author;
    author.style.color = "black";
    author.style.marginBottom = "10px";

    const year = document.createElement("p");
    year.textContent = "Tahun: " + book.year;
    year.style.color = "black";
    year.style.marginBottom = "10px";

    const BtnRemove = createActionButton("Hapus buku", "red", function () {
      // Menampilkan konfirmasi sebelum menghapus
      const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku?");
      if (confirmDelete === true) {
        removeBookItem(book.id);
        alert("Data Buku Berhasil Dihapus");
      } else {
        alert("Penghapusan Buku Dibatalkan");
      }
    });

    let BtnStatus;
    if (book.isComplete) {
      BtnStatus = createActionButton(
        "Belum selesai di Baca",
        "yellow",
        function () {
          toggleIsComplete(book.id);
        }
      );
    } else {
      BtnStatus = createActionButton("Selesai dibaca", "green", function () {
        toggleIsComplete(book.id);
      });
    }

    BtnRemove.style.padding = "10px";
    BtnRemove.style.margin = "10px";
    BtnRemove.style.borderRadius = "10px";
    BtnRemove.style.color = "white";
    BtnRemove.style.fontWeight = "bold";
    BtnRemove.style.border = "0";
    BtnRemove.style.backgroundColor = "#F93737";

    BtnStatus.style.padding = "10px";
    BtnStatus.style.borderRadius = "10px";
    BtnStatus.style.border = "0";
    BtnStatus.style.backgroundColor = "#5FBDFF";
    BtnStatus.style.color = "white";
    BtnStatus.style.fontWeight = "bold";

    actionButtons.appendChild(BtnStatus);
    actionButtons.appendChild(BtnRemove);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(actionButtons);

    return bookItem;
  }
  function createActionButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
  }
  document.addEventListener(SAVED_EVENT, function () {
    updateBookshelf();
  });
  updateBookshelf();
});
