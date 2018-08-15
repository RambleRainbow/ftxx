declare class BookDesc {
    name: string;
    descs: string[];
}

declare class Book {
    id: string;
    name: string;
    labels: string[];
    coverImage: string;
}

declare class BookDetail extends Book {
    images: string[];
    descs: BookDesc[];
}

declare class BookQueryOptions {
    id?: string;
    name?: string;
    labelsInclude?: string[];
    lablesExclude?: string[];
}

declare interface IBooks {
    Query(opts?: BookQueryOptions): Book[];
    QueryBookDetail(id: string): BookDetail;
    CreateBook(book: BookDetail): BookDetail;
}