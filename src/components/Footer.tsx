import { Github, Linkedin } from "lucide-react";

function Footer() {
  return (
    <div className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Flight Search. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {/* linkedin */}
          <a
            href="https://www.linkedin.com/in/chima-kingsley-nnachi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          {/* Github */}
          <a
            href="https://github.com/kingieX/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          {/* portfolio */}
          <a
            href="https://nnachi-kingsley.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
