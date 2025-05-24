export default function TopUsers() {
  const users = [
    { id: 1, name: "Nguyễn Văn A", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=4F8EDC&color=fff&size=100&rounded=true" },
    { id: 2, name: "Trần Thị B", avatar: "https://ui-avatars.com/api/?name=Trần+Thị+B&background=00B8A9&color=fff&size=100&rounded=true" },
    { id: 3, name: "Lê Văn C", avatar: "https://ui-avatars.com/api/?name=Lê+Văn+C&background=F9A826&color=fff&size=100&rounded=true" },
  ];

  const rankBadges = [
    { label: "Hạng 1", bgColor: "bg-yellow-400", textColor: "text-yellow-900" },
    { label: "Hạng 2", bgColor: "bg-gray-300", textColor: "text-gray-800" },
    { label: "Hạng 3", bgColor: "bg-yellow-700", textColor: "text-yellow-100" },
  ];

  return (
    <section className="py-16 bg-blue-50 font-varela">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center">
          Top Người Dùng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mb-4 shadow"
                loading="lazy"
              />
              <p className="text-lg font-semibold text-blue-800 mb-2 text-center">{user.name}</p>
              <div
                className={`${rankBadges[index]?.bgColor} ${rankBadges[index]?.textColor} px-4 py-1 rounded-full font-semibold text-sm text-center select-none`}
                aria-label={rankBadges[index]?.label}
                title={rankBadges[index]?.label}
              >
                {rankBadges[index]?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
