export const demo = { email: "demo@octosustain.com", password: "password123" };

export const demoPods = [
  {
    id: "1",
    name: "Green Office Warriors",
    description:
      "Reducing our workplace carbon footprint through energy tracking and waste reduction initiatives.",
    memberCount: 12,
    members: [
      { id: "1", name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
      { id: "2", name: "Bob Smith", avatar: "/thoughtful-man.png" },
      { id: "3", name: "Carol Davis", avatar: "/diverse-woman-portrait.png" },
    ],
    isLive: true,
    inviteCode: "GREEN123",
    category: "Workplace",
  },
  {
    id: "2",
    name: "Sustainable Families",
    description:
      "Families working together to create eco-friendly homes and teach children about environmental responsibility.",
    memberCount: 8,
    members: [
      { id: "4", name: "David Wilson", avatar: "/father-and-child.png" },
      { id: "5", name: "Emma Brown", avatar: "/loving-mother.png" },
    ],
    isLive: false,
    inviteCode: "GREEN123",

    category: "Family",
  },
  {
    id: "3",
    name: "Campus Eco Champions",
    description:
      "University students leading sustainability initiatives across campus through collaborative tracking and challenges.",
    memberCount: 25,
    members: [
      {
        id: "6",
        name: "Frank Miller",
        avatar: "/diverse-students-studying.png",
      },
      { id: "7", name: "Grace Lee", avatar: "/diverse-students-studying.png" },
      { id: "8", name: "Henry Chen", avatar: "/diverse-students-studying.png" },
    ],
    isLive: true,
    inviteCode: "GREEN123",

    category: "Education",
  },
];

export const demoPodData = {
  name: "Green Office Warriors",
  description:
    "Reducing our workplace carbon footprint through energy tracking and waste reduction initiatives.",
  memberCount: 12,
  members: [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/diverse-woman-portrait.png",
      role: "Admin",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/thoughtful-man.png",
      role: "Member",
    },
    {
      id: "3",
      name: "Carol Davis",
      avatar: "/diverse-woman-portrait.png",
      role: "Member",
    },
    {
      id: "4",
      name: "David Wilson",
      avatar: "/thoughtful-man.png",
      role: "Member",
    },
    {
      id: "5",
      name: "Emma Brown",
      avatar: "/diverse-woman-portrait.png",
      role: "Member",
    },
  ],
  isLive: true,
  category: "Workplace",
};

export const recentPodData = {
  name: "Green Office Warriors",
  memberCount: 12,
  activeMemberCount: 8,
  recentMembers: [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/diverse-woman-portrait.png",
      lastActive: "2 min ago",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/thoughtful-man.png",
      lastActive: "5 min ago",
    },
    {
      id: "3",
      name: "Carol Davis",
      avatar: "/diverse-woman-portrait.png",
      lastActive: "1 min ago",
    },
  ],
};
