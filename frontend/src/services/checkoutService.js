import API from "../api/axios";


export const checkoutOrder = async (data)=>{
    try{
        console.log("PAYMENT DATA:",
            data
        );
        const response = await API.post(
            "/orders/checkout",
            data
        );
        return response.data;
    }catch(error){
        throw (
            error.response?.data ||
            error.message
        );
    }
};
export const bookProduct = async (data) => {
    try {
        console.log(
            "CREATE ORDER DATA:",
            data
        );
        const res = await API.post(
            "/orders/book",
            data
        );
        return res.data;
    } catch(error) {
        throw (
            error.response?.data ||
            error.message
        );


    }

};
export const getMyOrders = async()=>{
    try{
    const response = await API.get(
    "/orders/my-orders"
    );
    return response.data;
    }catch(error){
    throw (
    error.response?.data ||
    error.message
    );
    }
};

export const getSingleOrder = async(id)=>{
    try{
    const response = await API.get(
    `/orders/${id}`

    );
    return response.data;
    }catch(error){
    throw (
    error.response?.data ||
    error.message

    );
    }
};