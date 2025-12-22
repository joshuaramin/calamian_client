import { Oxygen, Poppins, Rubik } from "next/font/google";

export const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});


export const rubik = Rubik({
    display: "auto",
    subsets: ["latin"],
    style: "normal",
    weight: "600"
})

export const oxygen = Oxygen({
    weight: "400",
    display: "auto",
    subsets: ["latin"]
})
