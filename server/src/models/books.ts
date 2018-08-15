/// <reference path="books.d.ts" />

import * as fs from "fs";
const books: any = require("../datas/books.json");

class Books implements IBooks {
    _books: BookDetail[];
    Query(opts: BookQueryOptions): Book[] {
        let rtn: Book[] = this._books.map( (item) => {
            return {
                id: item.id,
                name: item.name,
                coverImage: item.coverImage,
                labels: item.labels
            };
        });
        return rtn;
    }

    QueryBookDetail(id: string): BookDetail {
        let books: BookDetail[] = this._books.filter((item) => {
            return item.id === id;
        });

        if(books.length >= 1) {
            return books[0];
        } else {
            return null;
        }
    }

    CreateBook(book: BookDetail): BookDetail {
        book.id = (this._books.length + 1).toString();
        this._books.push(book);
        fs.writeFileSync("src/datas/books_bak.json", JSON.stringify(this._books, null, 2));
        return book;
    }

    constructor() {
        this._books = <BookDetail[]>books;
    }
}

export default <IBooks>(new Books());