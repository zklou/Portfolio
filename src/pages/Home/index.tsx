import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import styles from './index.less';

const HomePage: React.FC = () => (
  <div className={styles.page}>
    <div className={styles.grain} />
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
    <Footer />
  </div>
);

export default HomePage;
