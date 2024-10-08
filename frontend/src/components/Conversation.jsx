import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

export default function Conversation({
  conversation,
  isOnline,
  setIsMessageContainerOpen,
}) {
  const user = conversation?.participants?.[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() => {
        setIsMessageContainerOpen(true);
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        });
      }}
      bg={selectedConversation._id === conversation._id ? "gray.600" : ""}
      borderRadius={"md"}
    >
      <WrapItem>
        <span></span>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text
          fontSize={"xs"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          whiteSpace={"nowrap"}
        >
          {currentUser?._id === lastMessage?.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}

          {/* last message text or icon  */}

          {lastMessage?.text?.length > 18
            ? lastMessage?.text?.substring(0, 18) + "..."
            : lastMessage?.text}

          {lastMessage.image ? <BsFillImageFill size={16} /> : ""}
        </Text>
      </Stack>
    </Flex>
  );
}
