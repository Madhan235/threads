import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";

import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

export default function PostPage() {
  const { loading, user } = useGetUserProfile();

  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);

  const showToast = useShowToast();

  const { pid } = useParams();
  const navigate = useNavigate();
  let currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.message, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleCommentDeletion = (replyId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === currentPost._id
          ? {
              ...post,
              replies: post.replies.filter((reply) => reply._id !== replyId),
            }
          : post
      )
    );
  };

  const handleCommentEdit = (replyId, newComment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === currentPost._id
          ? {
              ...post,
              replies: post.replies.map((reply) =>
                reply._id === replyId ? { ...reply, text: newComment } : reply
              ),
            }
          : post
      )
    );
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        {" "}
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"} whiteSpace={"nowrap"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon
              cursor={"pointer"}
              size={20}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Get the app to like , reply and post.
          </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply?._id}
          currentPost={currentPost}
          handleCommentDeletion={handleCommentDeletion}
          handleCommentEdit={handleCommentEdit}
          reply={reply}
          lastReply={
            reply?._id ===
            currentPost.replies[currentPost.replies.length - 1]?._id
          }
        />
      ))}
    </>
  );
}
