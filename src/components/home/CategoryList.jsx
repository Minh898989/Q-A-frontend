import {
  FaBook,
  FaComments,
  FaBullhorn,
  FaBriefcase,
  FaBullseye,
  FaTools,
} from 'react-icons/fa';

export default function CategoryList() {
  const categories = [
    {
      icon: <FaBook className="text-5xl text-blue-600" />,
      title: "Học tập",
      description: "Hỏi đáp môn học, chia sẻ tài liệu, kinh nghiệm thi cử",
    },
    {
      icon: <FaComments className="text-5xl text-blue-600" />,
      title: "Giao lưu & Kết bạn",
      description: "Tâm sự, giới thiệu bản thân, chuyện đời sống sinh viên",
    },
    {
      icon: <FaBullhorn className="text-5xl text-blue-600" />,
      title: "Thông báo trường",
      description: "Tin tức chính thức, lịch học, sự kiện nhà trường",
    },
    {
      icon: <FaBriefcase className="text-5xl text-blue-600" />,
      title: "Việc làm & Thực tập",
      description: "Cơ hội việc làm, CV, phỏng vấn",
    },
    {
      icon: <FaBullseye className="text-5xl text-blue-600" />,
      title: "Câu lạc bộ & hoạt động",
      description: "CLB, hoạt động ngoại khóa, tình nguyện",
    },
    {
      icon: <FaTools className="text-5xl text-blue-600" />,
      title: "Kỹ năng & Công nghệ",
      description: "Học lập trình, kỹ năng mềm, công nghệ học tập",
    },
  ];

  return (
    <section className="py-16 bg-blue-50 font-varela">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-12 text-center">
          Danh Mục Chủ Đề
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <a
              key={index}
              href="/#"
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-blue-100 transition transform hover:-translate-y-1"
            >
              {category.icon}
              <h3 className="text-xl font-semibold text-blue-800 mt-4 mb-2 text-center">
                {category.title}
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed text-center">{category.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
