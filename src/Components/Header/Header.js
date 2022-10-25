import "./Header.css";
import {useCallback, useEffect, useRef} from "react";
import {Link} from "react-router-dom";

export default function Header({imgSrc, links}) {
    const headerRef = useRef(null), linkRef = useRef(null), menuRef = useRef(null);
    const menuToggle = useRef(['|||', "X"]);
    const width = useRef(0);

    const overFlowCheck = useCallback(function (header, link, menu) {
        if (header.clientWidth <= link.clientWidth && !width.current) {
            width.current = link.clientWidth;
            menu.classList.remove("hide");
            link.classList.add("menu");
        } else if (header.clientWidth > width.current) {
            width.current = 0;
            menu.classList.add("hide");
            link.classList.remove("menu");
            if (header.classList.contains("on")) onMenu(header, menu);
        }
    }, []);

    const mEvent = useCallback(function (event) {
        if (!linkRef.current.contains(event.target)) onMenu(headerRef.current, menuRef.current);
    }, []);

    const onMenu = useCallback(function (header, menu) {
        menuToggle.current = menuToggle.current.reverse();
        menu.value = menuToggle.current[0];
        header.classList.toggle("on");
        if (header.classList.contains("on"))
            window.addEventListener('click', mEvent);
        else
            window.removeEventListener('click', mEvent);
    }, [mEvent]);

    useEffect(() => {
        const header = headerRef.current;
        const resizeObserver = new ResizeObserver(() => overFlowCheck(header, linkRef.current, menuRef.current));
        resizeObserver.observe(header);

        return () => {
            resizeObserver.unobserve(header);
            console.clear();
        }
    }, [overFlowCheck]);

    return (
        <header className={"header-cnt"}>
            <img src={imgSrc} className={"header--hero"} alt={"header hero"}/>
            <div className={"header"} ref={headerRef}>
                <ul className={"header--links"} ref={linkRef}>
                    {links.map(link =>
                        <li key={links.indexOf(link)}>
                            <Link to={link.link} onClick={() => {
                                const header = headerRef.current;
                                if (header.classList.contains("on")) onMenu(header, menuRef.current);
                                window.scrollTo(0, 0);
                                document.body.classList.toggle("refresh");
                                setTimeout(() => document.body.classList.remove("refresh"), 750);
                            }}>{link.name}</Link>
                        </li>)}
                </ul>
                <input type="button" className={"header--menu"} ref={menuRef} value={"|||"}
                       onClick={(event) => event.stopPropagation() || onMenu(headerRef.current, menuRef.current)}/>
            </div>
        </header>
    );
}
