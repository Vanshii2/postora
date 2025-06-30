// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();
//   const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
//     mutationFn: async ({ coverImg, profileImg }) => {
//       const res = await fetch(`/api/users/update`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ coverImg, profileImg }),
//         credentials: "include"
//       });
//       if (!res.ok) throw new Error("Failed to update profile");
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Profile updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//       // Invalidate the user profile query as well if needed
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     }
//   });
//   return { updateProfile, isUpdatingProfile };
// };

// export default useUpdateUserProfile; 