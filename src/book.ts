import { Book } from "./types";
import { redirectToBookPage } from "./index";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('bookId') || '';
const ul = document.querySelector("ul")

window.addEventListener("load", async () => {
    //get from session storage
    const res = await fetch("http://localhost:3333/search/?id="+bookId)
    const book: Book = await res.json()
    buildBook(book)
    const suggestionsRes = await fetch("http://localhost:3333/suggestions/?id="+book.id)
    const suggestionsJson = await suggestionsRes.json()
    const suggestions: Book[] = suggestionsJson[0].similar
    buildSuggestions(suggestions)
}) 

const buildSuggestions = (suggestions: Book[]) => {
    if (ul!=null ){
      ul.innerHTML = ""
      suggestions.forEach(suggestion => {
          const li = document.createElement("li")
          const image = document.createElement("img")
          const legend  = document.createElement("legend")
          const bookTitle = document.createElement("span")
          const bookAuthor = document.createElement("span")
          const authors = JSON.parse(suggestion.author)[0]
          bookTitle.className = "titre"
          bookTitle.textContent = suggestion.title
          bookAuthor.className = "author"
          bookAuthor.textContent = authors ? authors.name : "Auhtor undefined"
          legend.appendChild(bookTitle)
          legend.appendChild(bookAuthor)
          image.src = suggestion.imagepath
          image.addEventListener("click", () => redirectToBookPage(suggestion.id))
          li.appendChild(image)
          li.appendChild(legend)
          ul.appendChild(li)
      })
    }
}

const buildBook = (book: Book) => {
    const authors = JSON.parse(book.author)[0]
    const bookDiv = document.querySelector(".book")
    const image = document.createElement("img")
    const legend  = document.createElement("legend")
    const bookTitle = document.createElement("span")
    const bookAuthor = document.createElement("span")
    const bookFileDiv = document.createElement("span")
    const bookFile = document.createElement("a")
    bookFileDiv.textContent = "Read the book : "
    bookFileDiv.appendChild(bookFile)
    bookFile.textContent = book.filepath
    bookFile.href = book.filepath
    bookTitle.className = "titre"
    bookTitle.textContent = book.title
    bookAuthor.className = "author"
    bookAuthor.textContent = authors ? authors.name : "Auhtor undefined"
    legend.appendChild(bookTitle)
    legend.appendChild(bookAuthor)
    legend.appendChild(bookFileDiv)
    image.src = book.imagepath
    if(bookDiv!=null){
        bookDiv.appendChild(image)
        bookDiv.appendChild(legend)
    }
    return bookDiv
}
