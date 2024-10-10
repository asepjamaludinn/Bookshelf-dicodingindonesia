const bookForm = document.getElementById("bookForm");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const bookFormSubmit = document.getElementById("bookFormSubmit");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchForm = document.getElementById("searchBook");
const searchInput = document.getElementById("searchBookTitle");
const searchSubmitButton = document.getElementById("searchSubmit");
const editBookModal = document.getElementById("editBookModal");
const editBookCancel = document.getElementById("editBookCancel");
const editBookForm = document.getElementById("editBookForm");

// menyimpan buku
let books = [];

//menambahkan buku ke dalam array
function addBook(title, author, year, isComplete) {
  const book = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(book);

  saveBooksToStorage();
  renderBooks();
}

//menyimpan buku ke dalam storage
function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// mengambil buku dari storage
function getBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

// merender buku ke dalam HTML
function renderBooks(booksToRender = books, sortFunction = null) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  if (sortFunction) {
    booksToRender.sort(sortFunction);
  } else {
    booksToRender.sort((a, b) => {
      if (a.isComplete && !b.isComplete) return -1;
      if (!a.isComplete && b.isComplete) return 1;
      return 0;
    });
  }

  booksToRender.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.dataset.bookid = book.id;
    bookItem.dataset.testid = "bookItem";
    bookItem.classList.add("book-item");
    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          ${
            book.isComplete
              ? `
            <button data-testid="bookItemIsCompleteButton" class="not-complete-button">Belum Selesai Dibaca</button>
          `
              : `
            <button data-testid="bookItemIsCompleteButton" class="is-complete-button">Selesai Dibaca</button>
          `
          }
          <button data-testid="bookItemDeleteButton" class="delete-button">Hapus Buku</button>
          <button data-testid="bookItemEditButton" class="edit-button">Edit Buku</button>
        </div>
      `;
    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}
//menghapus buku dari array
function deleteBook(id) {
  console.log("Fungsi deleteBook dijalankan");
  const bookIndex = books.findIndex((book) => book.id === parseInt(id));
  if (bookIndex !== -1) {
    console.log("Buku ditemukan");
    books.splice(bookIndex, 1);
    console.log("Buku dihapus");
    saveBooksToStorage();
    renderBooks();
  } else {
    console.log("Buku tidak ditemukan");
  }
}

// mengedit buku dalam array
function editBook(id, title, author, year, isComplete) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;
    books[bookIndex].isComplete = isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

// mengubah status buku menjadi selesai dibaca
function toggleBookStatus(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

// tombol submit
bookFormSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const title = bookFormTitle.value.trim();
  const author = bookFormAuthor.value.trim();
  const year = bookFormYear.value.trim();
  const isComplete = bookFormIsComplete.checked;

  if (title === "" || author === "" || year === "") {
    Swal.fire({
      title: "Form masih kosong!",
      text: "Silakan isi semua field yang diperlukan.",
      icon: "error",
    });
    return false;
  }
  addBook(title, author, year, isComplete);
  Swal.fire({
    title: "Buku berhasil ditambahkan!",
    text: "Buku telah berhasil ditambahkan ke daftar buku.",
    icon: "success",
  }).then(() => {
    bookForm.reset();
  });
});

// tombol selesai dibaca
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("is-complete-button")) {
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    const bookIndex = books.findIndex((book) => book.id === parseInt(bookId));
    if (bookIndex !== -1) {
      Swal.fire({
        title: "Tandai sebagai Selesai?",
        text: "Apakah Anda yakin ingin menandai buku ini sebagai selesai?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Selesai",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          books[bookIndex].isComplete = true;
          saveBooksToStorage();
          renderBooks();
          Swal.fire("Buku telah ditandai sebagai selesai!", "", "success");
        }
      });
    }
  } else if (e.target.classList.contains("not-complete-button")) {
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    const bookIndex = books.findIndex((book) => book.id === parseInt(bookId));
    if (bookIndex !== -1) {
      Swal.fire({
        title: "Tandai sebagai Belum Selesai?",
        text: "Apakah Anda yakin ingin menandai buku ini sebagai belum selesai?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Belum Selesai",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          books[bookIndex].isComplete = false;
          saveBooksToStorage();
          renderBooks();
          Swal.fire(
            "Buku telah ditandai sebagai belum selesai!",
            "",
            "success"
          );
        }
      });
    }
  }
});

// tombol edit buku
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    const bookData = getBookData(bookId);

    // Isi form edit buku dengan data buku yang dipilih
    editBookForm.elements["editBookId"].value = bookData.id;
    editBookForm.elements["editBookTitle"].value = bookData.title;
    editBookForm.elements["editBookAuthor"].value = bookData.author;
    editBookForm.elements["editBookYear"].value = bookData.year;
    editBookForm.dataset.iscomplete = bookData.isComplete;

    editBookModal.style.display = "block";
  }
});

// cancel button
editBookCancel.addEventListener("click", () => {
  editBookModal.style.display = "none";
});

editBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedBookData = {
    id: parseInt(editBookForm.elements["editBookId"].value),
    title: editBookForm.elements["editBookTitle"].value,
    author: editBookForm.elements["editBookAuthor"].value,
    year: editBookForm.elements["editBookYear"].value,
    isComplete: editBookForm.dataset.iscomplete === "true",
  };

  editBook(
    updatedBookData.id,
    updatedBookData.title,
    updatedBookData.author,
    updatedBookData.year,
    updatedBookData.isComplete
  );

  editBookModal.style.display = "none";
});

// mengedit buku dalam array
function editBook(id, title, author, year, isComplete) {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;
    books[bookIndex].isComplete = isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

// hapus buku
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    console.log("Delete button clicked!");
    const bookId = e.target.parentNode.parentNode.dataset.bookid;
    console.log(`Book ID: ${bookId}`);
    Swal.fire({
      title: "Hapus Buku?",
      text: "Apakah Anda yakin ingin menghapus buku ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBook(bookId);
        Swal.fire("Buku telah dihapus!", "", "success");
      }
    });
  }
});

// Fungsi data buku berdasarkan ID buku
function getBookData(bookId) {
  const bookIndex = books.findIndex((book) => book.id === parseInt(bookId));
  if (bookIndex !== -1) {
    return books[bookIndex];
  } else {
    return null;
  }
}

function updateBookData(updatedBookData) {
  const bookIndex = books.findIndex((book) => book.id === updatedBookData.id);
  if (bookIndex !== -1) {
    books[bookIndex] = updatedBookData;
    saveBooksToStorage();
    renderBooks();
  }
}

// Fungsi cari buku
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchQuery = searchInput.value.trim().toLowerCase();
  if (searchQuery === "") {
    Swal.fire({
      title: "Kolom cari buku masih kosong!",
      text: "Silakan isi kata kunci yang ingin dicari.",
      icon: "error",
    });
  } else {
    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery) ||
        book.year.toString().toLowerCase().includes(searchQuery)
      );
    });
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    if (filteredBooks.length === 0) {
      Swal.fire(
        "Buku tidak ditemukan!",
        "Coba lagi dengan kata kunci yang berbeda.",
        "error"
      );
    } else {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      filteredBooks.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.dataset.bookid = book.id;
        bookItem.dataset.testid = "bookItem";
        bookItem.innerHTML = `
              <h3 data-testid="bookItemTitle">${book.title}</h3>
              <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
              <p data-testid="bookItemYear">Tahun: ${book.year}</p>
              <div>
                ${
                  book.isComplete
                    ? `
                  <button data-testid="bookItemIsCompleteButton" class="not-complete-button">Belum Selesai Dibaca</button>
                `
                    : `
                  <button data-testid="bookItemIsCompleteButton" class="is-complete-button">Selesai Dibaca</button>
                `
                }
                <button data-testid="bookItemDeleteButton" class="delete-button">Hapus Buku</button>
                <button data-testid="bookItemEditButton" class="edit-button">Edit Buku</button>
              </div>
            `;
        if (book.isComplete) {
          completeBookList.appendChild(bookItem);
        } else {
          incompleteBookList.appendChild(bookItem);
        }
      });
    }
  }
});
document.getElementById("sort-button").addEventListener("click", () => {
  const dropdown = document.querySelector(".sort-dropdown");
  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
  } else {
    dropdown.classList.add("show");
  }
});

document.getElementById("sort-by-title").addEventListener("click", () => {
  renderBooks(books, (a, b) => a.title.localeCompare(b.title));
  document.getElementById("sort-button").blur();
  document.querySelector(".sort-dropdown").classList.remove("show"); // Add this line to close the dropdown
});

document.getElementById("sort-by-author").addEventListener("click", () => {
  renderBooks(books, (a, b) => {
    const authorA = a.author.toUpperCase();
    const authorB = b.author.toUpperCase();
    if (authorA < authorB) return -1;
    if (authorA > authorB) return 1;
    return 0;
  });
  document.getElementById("sort-button").blur();
  document.querySelector(".sort-dropdown").classList.remove("show"); // Add this line to close the dropdown
});

document.getElementById("sort-by-year").addEventListener("click", () => {
  renderBooks(books, (a, b) => a.year - b.year);
  document.getElementById("sort-button").blur();
  document.querySelector(".sort-dropdown").classList.remove("show"); // Add this line to close the dropdown
});
document.querySelector(".sort-dropdown").addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    document.querySelector(".sort-dropdown").classList.remove("show");
  }
});

// Inisialisasi aplikasi
getBooksFromStorage();
renderBooks();
