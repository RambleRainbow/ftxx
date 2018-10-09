declare class BookDesc {
    name: string;
    descs: string[];
}

declare class Book {
    _id: string;
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
    Query(opts?: BookQueryOptions): Promise<Book[]>;
    QueryBookDetail(id: string): Promise<BookDetail>;
    CreateBook(book: BookDetail): Promise<BookDetail>;
    QueryBookLikes(id: string): Promise<number>;
    QueryIsUserLike(id: string, userId: string): Promise<boolean>
    AddUserLike(id: string, userId: string): Promise<boolean>;
    RemoveUserLike(id: string, userId: string): Promise<boolean>;
}