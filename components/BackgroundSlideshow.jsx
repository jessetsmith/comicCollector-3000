import { useEffect } from "react"
import "../styles/BackgroundSlideshow.scss"

export default function BackgroundSlideshow() {
    useEffect(() => {
        const images = [
            "../comicCollector-3000/images/bg_images/erik-mclean-0_wXoeCDry0-unsplash.jpg",
            "../comicCollector-3000/images/bg_images/pexels-chuck-3744195.jpg",
            "../comicCollector-3000/images/bg_images/pexels-chuck-3744196.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-6654169.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-6654171.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-6654172.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-6654173.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-6654177.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7524992.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7524993.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7524996.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7524998.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7768661.jpg",
            "../comicCollector-3000/images/bg_images/pexels-introspectivedsgn-7768663.jpg",
            "../comicCollector-3000/images/bg_images/pexels-maria-firman-150089027-12113866.jpg",
            "../comicCollector-3000/images/bg_images/pexels-maria-firman-150089027-12113867.jpg",
            "../comicCollector-3000/images/bg_images/pexels-nerdcinema-20085947.jpg",
            "../comicCollector-3000/images/bg_images/pexels-sumeyye-ugurlu-2759284-6807234.jpg",
            "../comicCollector-3000/images/bg_images/pexels-theshuttervision-8811520.jpg",
            "../comicCollector-3000/images/bg_images/pexels-theshuttervision-8811521.jpg",
            "../comicCollector-3000/images/bg_images/pexels-theshuttervision-12328057.jpg"
            // Add more images as needed
        ]


        let currentImageIndex = 0
        const changeBackgroundImage = () => {
            document.body.style.backgroundImage = `url(${images[currentImageIndex]})`
            currentImageIndex = (currentImageIndex + 1) % images.length
        }

        changeBackgroundImage()
        const interval = setInterval(changeBackgroundImage, 10000) // Change image every 10 seconds

        return () => clearInterval(interval)
    }, [])

    return null
}