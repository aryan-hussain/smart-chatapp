"use client"
import React, { useState } from "react";
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";

import Image from "next/image";
import { Home, Library, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar({ selectedItem }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleDialogOpen = (event) => {
    setIsDialogOpen(!isDialogOpen);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    const data = await signOut({ redirect: false, callbackUrl: "/sign-in" });
    router.push(data.url);
  };

  return (
    <>
      <Card className="h-screen w-full max-w-[18rem] pt-4 shadow-xl shadow-blue-gray-900/5 hidden lg:flex">
        <div className="flex items-center gap-4 p-4">
          <Image src="/logo.svg" alt="Logo" width={150} height={150} />
        </div>
        <List>
          <hr className="my-2 border-blue-gray-50" />
          <Link href={"/"}>
            <ListItem
              selected={selectedItem === "Home" ? true : false}
              className="py-1.5 gap-3"
            >
              <ListItemPrefix>
                <Home size={16} />
              </ListItemPrefix>
              Home
            </ListItem>
          </Link>
          <Link href={"/library"}>
            <ListItem
              selected={selectedItem === "Library" ? true : false}
              className="py-1.5 gap-3"
            >
              <ListItemPrefix>
                <Library size={16} />
              </ListItemPrefix>
              Library
            </ListItem>
          </Link>
        </List>
        
      </Card>

      <div className="flex flex-row w-full h-[50px] shadow-xl shadow-blue-gray-900/5 lg:hidden">
        <IconButton variant="text" size="lg" onClick={openDrawer}>
          {isDrawerOpen ? <X /> : <Menu />}
        </IconButton>
      </div>
      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="lg:hidden">
        <Card
          color="transparent"
          shadow={false}
          className="h-screen w-full pt-4"
        >
          <div className="flex flex-row justify-between items-center gap-4 p-4">
            <Image src="/logo.svg" alt="Logo" width={150} height={150} />
            <IconButton variant="text" size="md" onClick={closeDrawer}>
              <X />
            </IconButton>
          </div>
          <List>
            <hr className="my-2 border-blue-gray-50" />
            <Link href={"/"}>
              <ListItem
                selected={selectedItem === "Home" ? true : false}
                className="py-1.5"
              >
                <ListItemPrefix>
                  <Home size={16} />
                </ListItemPrefix>
                Home
              </ListItem>
            </Link>
            <Link href={"/library"}>
              <ListItem
                selected={selectedItem === "Library" ? true : false}
                className="py-1.5"
              >
                <ListItemPrefix>
                  <Library size={16} />
                </ListItemPrefix>
                Library
              </ListItem>
            </Link>
          </List>
          
        </Card>
      </Drawer>

      <Dialog open={isDialogOpen} handler={handleDialogOpen} size="sm">
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Confirm Logout
          </Typography>
        </DialogHeader>
        <DialogBody className="grid place-items-start gap-4">
          <Typography className="text-center font-normal">
            Are you sure you want to log out? Any unsaved changes will be lost.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleDialogOpen}
            disabled={isLoggingOut}
          >
            No
          </Button>
          <Button
            className="flex items-center gap-3"
            onClick={handleLogout}
            disabled={isLoggingOut}
            loading={isLoggingOut}
          >
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
