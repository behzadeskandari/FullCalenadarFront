
import React ,{useEffect, useState}from 'react'
import {Container, Nav, NavDropdown, Navbar} from 'react-bootstrap';
import Home from '../assets/home1.png'
import Logo from '../assets/Logo2.png'
import skills from '../assets/skills1.png'
import projects1 from '../assets/projects1.png'
export default function NavBar() {
    const [activeLink , setActiveLink] = useState("home");
    const [scrolled,setScrolled]= useState(false);

    useEffect(()=> {
                const onScroll = () => {
                    if(window.scroll > 50){
                        setScrolled(true);
                    }else{
                        setScrolled(false);
                    }
                }
                window.addEventListener("scroll", onScroll);

                return () => {
                    window.removeEventListener("scroll",onScroll);
                }
    },[])
    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    return (
    <Navbar  expand="lg" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href='#home'>
            <img src={Logo} alt="logo" className='logo'/>
        </Navbar.Brand>
        <Navbar.Toggle href='#home' aria-controls='basic-navbar-nav'>
            <span className='navbar-toggler-icon'></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='me-auto'>
                <Nav.Link href='#home' className={activeLink === "home" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink('home')}>
                    HOME
                </Nav.Link>
                <Nav.Link href='#skills' className={activeLink === "skills" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink('skills')}>
                    Skills
                </Nav.Link>
                
                <Nav.Link href='#projects' className={activeLink === "projects" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink('projects')}>
                    Projects
                </Nav.Link>
                <span className='navbar-text'>
                    <div className='social-icon'>
                        <a href='#'><img src={Home} alt={""}/></a>
                        
                        <a href='#'><img src={skills} alt={""}/></a>
                        
                        <a href='#'><img src={projects1} alt={""}/></a>
                    </div>
                    <button className='vvd' onClick={() => console.log('connect')}>
                        <span>Lets Connect</span>
                    </button>
                </span>
                {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item href='#action/3.2'>Action2</NavDropdown.Item>
                    
                </NavDropdown> */}
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
