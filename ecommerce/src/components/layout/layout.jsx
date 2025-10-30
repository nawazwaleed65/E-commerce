import Footer from "../Footer/footer"
import Navbar from "../navbar/navbar"


function Layout({ children }) {
  return (
    <div>
      <Navbar/>
      <div className="content">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default Layout