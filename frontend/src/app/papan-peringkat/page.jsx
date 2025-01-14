"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AutoScroll from "@/components/ui/auto-scroll";
import getRandomColor from "@/lib/getRandomColor";
import TrophyUmkm from "./trophy";
import { Facebook, Instagram, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useModalLoginStore from "@/store/modalLoginStore";
import Medal from "../papan-peringkat/medal";
import { useEffect } from "react";
import axios from "axios";
import useTokenStore from "@/hook/useTokenStore";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/lib/sosmedIcon";

const getIcon = (platform) => {
  switch (platform) {
    case "instagram":
      return (
        <InstagramIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
      );
    case "facebook":
      return (
        <FacebookIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
      );
    case "tiktok":
      return (
        <TiktokIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
      );
    case "youtube":
      return (
        <YoutubeIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
      );
    default:
      return null;
  }
};

const getRankTitle = (rank) => {
  if (rank <= 5) return "Heroic Volunteer";
  if (rank <= 15) return "Active Volunteer";
  return "New Volunteer";
};

const RankCard = ({ rank, user }) => {
  return (
    <div className="relative flex flex-col justify-between h-40 p-5 border rounded-md bg-third border-muted">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-zinc-300 size-8" />
          <h1 className="text-sm font-medium text-zinc-700">{user.name}</h1>
        </div>

        <TrophyUmkm rank={rank} className="w-8 lg:w-10" />
      </div>

      <div className="flex items-center gap-2">
        <Medal rank={rank} className="size-6" />
        <span className="text-sm font-medium">{getRankTitle(rank)}</span>
      </div>

      <div className="flex items-center justify-between ps-1.5">
        <p className="text-sm font-medium text-zinc-500">
          Total Survei {user.products_count}
        </p>
        <p className="text-sm font-medium text-zinc-700">Poin {user.points}</p>
      </div>

      <Badge className="absolute items-center justify-center hidden text-sm -translate-x-1/2 rounded-full md:flex size-8 bg-secondary left-1/2 -bottom-5">
        {rank}
      </Badge>
    </div>
  );
};

const RankLedderBar = ({ users = [] }) => {
  // const data = [
  //   { name: "User A", points: 1000 },
  //   { name: "User B", points: 965 },
  //   { name: "User C", points: 925 },
  //   { name: "User D", points: 890 },
  //   { name: "User E", points: 850 },
  //   { name: "User F", points: 815 },
  //   { name: "User G", points: 775 },
  //   { name: "User H", points: 740 },
  //   { name: "User I", points: 700 },
  //   { name: "User J", points: 665 },
  // ];

  const maxPoints = Math.max(...users.slice(0, 10).map((user) => user.points));

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");

  return (
    <div className="grid w-full h-full grid-cols-10 gap-3 p-3 border rounded-lg shadow-sm md:p-5 border-muted bg-third">
      {users.slice(0, 10).map((user, idx) => (
        <div
          key={idx}
          style={{ height: `calc(${(user.points / maxPoints) * 100}%)` }}
          className="flex flex-col items-center gap-3 mt-auto"
        >
          <div
            className={`flex items-center justify-center text-white group rounded-full min-h-7 size-7 md:min-h-8 md:size-8 relative cursor-pointer text-xs font-semibold`}
            style={{ backgroundColor: getRandomColor() }}
          >
            {getInitials(user.name)}

            <div className="absolute px-4 py-2 text-center transition-all duration-200 scale-90 -translate-x-1/2 bg-white border rounded-sm opacity-0 pointer-events-none visibility-hidden text-zinc-700 whitespace-nowrap top-10 left-1/2 border-muted group-hover:opacity-100 group-hover:visibility-visible group-hover:scale-100 group-hover:-translate-y-2 group-hover:pointer-events-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-700">
                  <div className="p-2 rounded-full bg-muted">
                    <User className="size-4" />
                  </div>
                  {user.name}
                </div>
                <ul className="space-y-1 text-zinc-500">
                  {user.medsoses &&
                    user.medsoses.map((medsos, idx) => (
                      <li key={idx}>
                        <a
                          className="flex items-center gap-2 text-sm-50 hover:underline"
                          href={medsos?.url}
                          target="__blank"
                        >
                          {getIcon(medsos?.platform?.toLowerCase())}
                          <span>{medsos?.username}</span>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full h-full bg-primary rounded-t-md" />
          <span className="text-xs text-zinc-600">{user.points}</span>
        </div>
      ))}
    </div>
  );
};

const TableComponent = ({ users = [] }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const token = useTokenStore((state) => state.token);
  // const { openLoginModal } = useModalLoginStore();

  // useEffect(() => {
  //   if (!token) {
  //     return openLoginModal();
  //   }
  // }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setCurrentUser(res.data.data);
        });
    }
  }, [token]);


  // const user_dummy = [
  //   {
  //     id: 1,
  //     name: "User A",
  //     medsoses: [
  //       { platform: "instagram", username: "user_a" },
  //       { platform: "facebook", username: "user_a" },
  //     ],
  //     products_count: 100,
  //     points: 1000,
  //   },
  // ]

  return (
    <AutoScroll
      className="max-h-[400px] border-y border-muted  rounded-lg"
      AutoScrollHeight={200}
    >
      <Table className="w-full rounded-full table-fixed">
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow className="bg-muted">
            <TableHead className="w-[7%] px-4 md:w-[10%] text-center">
              <span className="hidden sm:block">Peringkat</span>
            </TableHead>
            <TableHead className="w-1/4 px-4">Nama</TableHead>
            <TableHead className="w-1/6 px-4">Media Sosial</TableHead>
            <TableHead className="w-1/6 px-4 text-center whitespace-nowrap">
              Total Survei
            </TableHead>
            <TableHead className="w-1/6 px-4 text-center md:w-auto">
              Point
            </TableHead>
            <TableHead className="px-4 column-hidden-md">Rank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow
              key={idx}
              className={`h-10 text-xs md:text-sm ${currentUser && currentUser.id === user.id
                  ? "bg-gradient-to-r from-orange-50 from-10% via-white to-white"
                  : ""
                }`}
            >
              <TableCell className="text-center">{idx + 1}</TableCell>
              <TableCell className="flex items-center gap-3 font-medium">
                <div className="rounded-full bg-zinc-300 size-6" />
                {user.name}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2">
                  {user.medsoses
                    ? user.medsoses.map((medsos, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 rounded-full cursor-pointer size-4"
                        onClick={() => {
                          window.open(medsos?.url, "_blank");
                        }}
                      >
                        {getIcon(medsos?.platform?.toLowerCase())}
                      </span>
                    ))
                    : "-"}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {user.products_count}
              </TableCell>
              <TableCell className="text-center">{user.points}</TableCell>
              <TableCell className="flex items-center gap-2 column-hidden-md">
                <Medal rank={idx + 1} className="size-6" />
                <span className="font-medium">{getRankTitle(idx + 1)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AutoScroll>
  );
};

export default function PapanPeringkatPage() {
  const { openLoginModal } = useModalLoginStore();
  const [users, setUsers] = useState([]);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/ranking`)
      .then((res) => {
        // console.log(res.data.data);
        setUsers(res.data.data);
      });
  }, []);

  return (
    <div className="max-w-screen-xl p-5 mx-auto space-y-6">
      <div className="grid grid-cols-12 gap-6 ">
        {/* useTokenStore((state) => state.token) */}
        <div className="w-full col-span-12 h-44 md:h-60 md:col-span-6  relative bg-[url('/images/umkm/umkm_ilust_4.png')] object-cover bg-bottom rounded-lg">
          <div className="absolute bottom-0 w-full h-full rounded-lg bg-gradient-to-t from-black to-black/40" />
          <div className="absolute flex flex-col justify-between w-full px-5 sm:items-center sm:flex-row bottom-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-full text-4xl text-center bg-white rounded-full max-w-16 size-16 min-w-16 md:min-w-20 md:size-20 md:max-w-20">
                {token ? "🏆" : "🚪"}
              </div>
              <div className="space-y-2.5">
                <h1 className="text-xl font-semibold text-white md:text-2xl">
                  {token
                    ? "Papan Peringkat Volunteer terbaik"
                    : "Selamat Datang!"}
                </h1>
                <span className="w-4/5 text-[14px] leading-none md:text-sm md:2/3 lg:w-1/2 text-zinc-300">
                  {token
                    ? "Lihat siapa yang berada di papan peringkat"
                    : "Login untuk melihat papan peringkat"}
                </span>
              </div>
            </div>

            {!token && (
              <div className="mt-3 ml-20 md:ml-4 md:mt-auto">
                <Button
                  className="h-8 text-xs md:text-sm md:h-9"
                  onClick={() => openLoginModal()}
                >
                  Bergabung
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12 h-60 md:col-span-6">
          <RankLedderBar users={users} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {users.slice(0, 3).map((user, idx) => (
          <RankCard key={idx} rank={idx + 1} user={user} />
        ))}
      </div>

      <TableComponent users={users} />
    </div>
  );
}
