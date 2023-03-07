import { useEffect, useRef, useState, RefCallback, useCallback } from 'react';
import type { ImgHTMLAttributes } from "react";

type LazyImageProps = {
    src:string;
    onLazyLoad?:(img:HTMLImageElement)=>void;
}

type Props = LazyImageProps & ImgHTMLAttributes<HTMLImageElement>;

export const LazyImage = ({src, onLazyLoad, ...imgProps}:Props):JSX.Element => {
    const node = useRef<HTMLImageElement>(null);

    const [isLazyLoaded, setIsLazyLoaded] = useState(false);

    const [CurrentSrc, setCurrentSrc] = useState<string>("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=")

    useEffect(() => {
        if (isLazyLoaded){
            return;
        }
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach((entry => {
                if (entry.isIntersecting){
                    setCurrentSrc(src)
                    observer.disconnect()
                    setIsLazyLoaded(true)

                    if (typeof onLazyLoad === "function" && node.current){
                        onLazyLoad(node.current);
                    }
                }
            }))
        })
        
        if (node.current){
            observer.observe(node.current);
        }

        return () => {
            observer.disconnect()
        }


        
    }, [src, onLazyLoad, isLazyLoaded]);
    
    return <img ref={node} src={CurrentSrc} {...imgProps}></img>
}