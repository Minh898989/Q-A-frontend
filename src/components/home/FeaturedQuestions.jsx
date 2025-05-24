import React from 'react';
import { FaThumbsUp, FaCommentDots } from 'react-icons/fa';

const questions = [
  {
    title: "Làm thế nào để học tốt môn Toán rời rạc?",
    author: "Nguyễn Văn A",
    date: "2025-05-20",
    tags: ["#toanhoc", "#hoctap"],
    votes: 25,
    comments: 10,
  },
  {
    title: "Cách chuẩn bị cho kỳ thi IELTS hiệu quả?",
    author: "Trần Thị B",
    date: "2025-05-19",
    tags: ["#ielts", "#tienganh"],
    votes: 18,
    comments: 8,
  },
  {
    title: "Mẹo tìm việc làm thêm cho sinh viên?",
    author: "Lê Văn C",
    date: "2025-05-18",
    tags: ["#vieclam", "#kinhnghiem"],
    votes: 30,
    comments: 15,
  },
  {
    title: "Học lập trình Python từ đâu cho người mới?",
    author: "Phạm Thị D",
    date: "2025-05-17",
    tags: ["#laptrinh", "#python"],
    votes: 22,
    comments: 12,
  }
];

function QuestionCard({ title, author, date, tags, votes, comments }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col h-full">
      <h3 className="text-xl font-semibold text-blue-900 mb-4 line-clamp-3">
        {title}
      </h3>

      <div className="text-sm text-blue-700 mb-4">
        <p><span className="font-medium">Đăng bởi:</span> {author}</p>
        <p><span className="font-medium">Ngày:</span> {new Date(date).toLocaleDateString("vi-VN")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-start gap-6 text-indigo-600 font-semibold">
        <div className="flex items-center space-x-2">
          <FaThumbsUp />
          <span>{votes}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaCommentDots />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedQuestions() {
  return (
    <section className="py-16 bg-blue-50 font-varela">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center">
          Câu Hỏi Nổi Bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              title={question.title}
              author={question.author}
              date={question.date}
              tags={question.tags}
              votes={question.votes}
              comments={question.comments}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
