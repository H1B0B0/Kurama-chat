import RoomSideBar from "@/components/Room/RoomSideBar";
import RoomProvider from "@/contexts/RoomContext";
import SocketProvider from "@/contexts/SocketContext";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoomProvider>
      <SocketProvider>
        <div className="flex h-screen space-x-2 space-y-2">
          <RoomSideBar />
          {children}
        </div>
      </SocketProvider>
    </RoomProvider>
  );
}
