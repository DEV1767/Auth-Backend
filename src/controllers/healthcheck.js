import { ApiResponse } from "../utils/api_response.js";
import { asynchandler } from "../utils/async_handler.js";

const healthcheck = asynchandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { message: "Hii !! Server is Running" })
    )
})

export { healthcheck };