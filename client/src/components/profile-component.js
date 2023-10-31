const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <div className="p-12">
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登錄。</div>}
      {currentUser && (
        <div>
          <h2 className="text-xl font-bold mb-4">以下是您的個人檔案：</h2>

          <table className="min-w-full table-auto border-collapse">
            <tbody>
              <tr className="border-t">
                <td className="py-2 flex justify-center my-6">
                  <img
                    src={currentUser.image}
                    alt="使用者頭像"
                    className="rounded-full w-32 h-32 object-cover"
                  />
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    姓名：{currentUser.name}
                  </strong>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    ID: {currentUser.id}
                  </strong>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    電子信箱: {currentUser.email}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
