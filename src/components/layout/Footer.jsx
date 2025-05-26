import { FacebookFilled, InstagramFilled, TwitterCircleFilled } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer className="bg-blue-100 text-blue-800 py-12 border-t border-blue-200 font-varela">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Giới thiệu */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Diễn Đàn Sinh Viên</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Nơi sinh viên kết nối, chia sẻ và học hỏi cùng nhau!
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <a href="/#" className="hover:text-blue-600 transition-colors duration-300">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a href="/#" className="hover:text-blue-600 transition-colors duration-300">
                  Danh mục
                </a>
              </li>
              <li>
                <a href="/#" className="hover:text-blue-600 transition-colors duration-300">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Liên hệ + Mạng xã hội */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Liên hệ</h3>
            <p className="text-sm mb-1">
              Email:{' '}
              <a href="mailto:support@diendansinhvien.com" className="underline hover:text-blue-600">
                support@diendansinhvien.com
              </a>
            </p>
            <p className="text-sm mb-4">
              Hotline:{' '}
              <a href="tel:0123456789" className="underline hover:text-blue-600">
                0123 456 789
              </a>
            </p>

            {/* Icon mạng xã hội */}
            <div className="flex space-x-4 mt-2 text-blue-600 text-2xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-800 transition"
              >
                <FacebookFilled />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500 transition"
              >
                <InstagramFilled />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-sky-500 transition"
              >
                <TwitterCircleFilled />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-blue-700 select-none">
          © 2025 Diễn Đàn Sinh Viên. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
