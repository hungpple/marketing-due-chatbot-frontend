export const navItems = [
  { label: "Trang chủ", href: "/", external: false },
  { label: "Giới thiệu", href: "/gioi-thieu", external: false },
  { label: "Chatbot AI", href: "/chatbot-ai", external: false },
  {
    label: "Khoa Marketing - DUE",
    href: "https://due.udn.vn/vi-vn/khoa/marketing",
    external: true,
  },
] as const;

export const quickQuestions = [
  "Khoa Marketing đào tạo những ngành hoặc chuyên ngành nào?",
  "Phương thức xét tuyển vào Khoa Marketing gồm những gì?",
  "Học phí và học bổng của sinh viên Khoa Marketing như thế nào?",
  "Sinh viên Marketing-DUE có cơ hội nghề nghiệp nào sau khi tốt nghiệp?",
] as const;

export const aboutFeatureCards = [
  {
    title: "Thông tin tuyển sinh",
    description:
      "Hỗ trợ hỏi đáp về phương thức xét tuyển, tổ hợp môn, chỉ tiêu, mốc thời gian và hồ sơ cần chuẩn bị.",
  },
  {
    title: "Ngành học và chương trình đào tạo",
    description:
      "Giới thiệu các định hướng học tập, học phần tiêu biểu, kỹ năng sinh viên được trang bị và trải nghiệm học tập tại Khoa Marketing.",
  },
  {
    title: "Học phí, học bổng và hỗ trợ sinh viên",
    description:
      "Cung cấp thông tin tham khảo về chi phí học tập, chính sách học bổng, hoạt động hỗ trợ và môi trường sinh viên.",
  },
  {
    title: "Cơ hội nghề nghiệp",
    description:
      "Gợi ý các vị trí nghề nghiệp liên quan đến marketing, truyền thông, thương hiệu, nghiên cứu thị trường và kinh doanh số.",
  },
] as const;

export const chatbotHighlights = [
  "Tra cứu nhanh thông tin tuyển sinh",
  "Gợi ý câu hỏi theo nhu cầu của thí sinh",
  "Câu trả lời thân thiện, dễ hiểu, có thể tích hợp nguồn tham khảo",
] as const;
