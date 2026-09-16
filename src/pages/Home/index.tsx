import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Projects from './components/Projects';
import Skills from './components/Skills';
import styles from './index.less';

const HomePage: React.FC = () => (
  <div className={styles.page} id="top">
    <div className={styles.grain} />
    <Nav />
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
    <Footer />
  </div>
);

export default HomePage;
