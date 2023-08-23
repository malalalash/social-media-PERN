import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 mt-10 bg-gray-800 fixed bottom-0">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <p className="text-white text-base">Made by Mikołaj Malarczyk</p>
        <a
          className="hover:rotate-6 transform duration-200"
          href="https://github.com/malalalash"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read more about creator on github"
        >
          <BsGithub size={25} style={{ color: "white" }} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
