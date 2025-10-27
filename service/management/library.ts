import {ApiRoute} from "@/constants/apiRoute";
import axios from "axios";

const get_headers = () => {
    const access_token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};

const add_book =async (data: any) => {
    return axios.post(ApiRoute.LIBRARY.book_crud, data, {
        headers:await get_headers(),
    });
};

const get_books = async () => {
    try {
        const res = await axios.get(ApiRoute.LIBRARY.book_crud, {
            headers:await get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};


const search_books = async (query: string) => {
    let route = ApiRoute.LIBRARY.search_book
    if (query) {
        route = `${ApiRoute.LIBRARY.search_book}?q=${query}`
    }
    try {
        const res = await axios.get(ApiRoute.LIBRARY.search_book, {
            headers:await get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};

const delete_book = async (bookId: string) => {
    return axios.delete(`${ApiRoute.LIBRARY.book_crud}/${bookId}`, {
        headers:await get_headers(),
    });
};

const update_book = async (bookId: string, data: any) => {
    return axios.put(`${ApiRoute.LIBRARY.book_crud}/${bookId}`, data, {
        headers:await get_headers(),
    });
};

const assign_book = async (data:any) => {
    return axios.post(ApiRoute.LIBRARY.assignBook, data, {
        headers:await get_headers(),
    });
};

const return_book = async (data: any) => {
    return axios.post(ApiRoute.LIBRARY.returnBook, data, {
        headers:await get_headers(),
    });
};

const get_due_books = async () => {
    try {
        const res = await axios.get(ApiRoute.LIBRARY.dueBooks, {
            headers:await get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};



const get_borrowed_books = async (student_id:string) => {
    try {
        const res = await axios.get(`${ApiRoute.LIBRARY.getBorrowedBook}/${student_id}`, {
            headers:await get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return null;
    }
};


export {
    add_book,
    get_books,
    search_books,
    delete_book,
    update_book,
    assign_book,
    return_book,
    get_due_books,
    get_borrowed_books

};
