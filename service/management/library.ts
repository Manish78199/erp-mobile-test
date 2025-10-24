import routes from "@/config/route";
import axios from "axios";

const get_headers = () => {
    const access_token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};

const add_book = (data: any) => {
    return axios.post(routes.LIBRARY.book_crud, data, {
        headers: get_headers(),
    });
};

const get_books = async () => {
    try {
        const res = await axios.get(routes.LIBRARY.book_crud, {
            headers: get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};


const search_books = async (query: string) => {
    let route = routes.LIBRARY.search_book
    if (query) {
        route = `${routes.LIBRARY.search_book}?q=${query}`
    }
    try {
        const res = await axios.get(routes.LIBRARY.search_book, {
            headers: get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};

const delete_book = (bookId: string) => {
    return axios.delete(`${routes.LIBRARY.book_crud}/${bookId}`, {
        headers: get_headers(),
    });
};

const update_book = (bookId: string, data: any) => {
    return axios.put(`${routes.LIBRARY.book_crud}/${bookId}`, data, {
        headers: get_headers(),
    });
};

const assign_book = (data:any) => {
    return axios.post(routes.LIBRARY.assignBook, data, {
        headers: get_headers(),
    });
};

const return_book = (data: any) => {
    return axios.post(routes.LIBRARY.returnBook, data, {
        headers: get_headers(),
    });
};

const get_due_books = async () => {
    try {
        const res = await axios.get(routes.LIBRARY.dueBooks, {
            headers: get_headers(),
        });
        return res.data.data;
    } catch (error) {
        return [];
    }
};



const get_borrowed_books = async (student_id:string) => {
    try {
        const res = await axios.get(`${routes.LIBRARY.getBorrowedBook}/${student_id}`, {
            headers: get_headers(),
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
