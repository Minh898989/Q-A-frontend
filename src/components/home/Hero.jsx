import React from 'react';
import heroImage from '../../assets/images/graduation-cap.png';

const Hero = React.memo(() => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-white to-blue-100 pt-32 pb-24 font-varela">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="animate-blob bg-blue-300 opacity-30 rounded-full w-72 h-72 absolute -top-20 -left-20"></div>
        <div className="animate-blob animation-delay-2000 bg-blue-400 opacity-20 rounded-full w-96 h-96 absolute -bottom-32 -right-24"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2 text-left text-blue-900 z-10">
          <h1 className="text-6xl font-extrabold leading-tight max-w-xl drop-shadow-md">
            Diễn Đàn Hỏi Đáp <br />
            <span className="block text-indigo-600">Sinh Viên</span>
          </h1>
          <p className="mt-8 text-xl max-w-lg leading-relaxed text-blue-700 drop-shadow-sm">
            Tham gia ngay để trao đổi kiến thức, đặt câu hỏi và kết nối với cộng đồng sinh viên trong trường!
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <a
              href="/#"
              className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1"
            >
              Đặt câu hỏi ngay
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center z-10">
          <img
            src={heroImage}
            alt="Sinh viên hỏi đáp"
            className="w-full max-w-sm object-contain drop-shadow-2xl rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-110"
            style={{ maxHeight: '420px' }}
          />
        </div>
      </div>
    </section>
  );
});

export default Hero;
