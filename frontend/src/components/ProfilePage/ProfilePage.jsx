import React, { useState } from "react";
import { getGreeting } from "../../helpers/getGreeting";
import { useUser } from "../../query/queries";
import "./profilePage.scss";
import { formatDate } from "../../helpers/dateHelpers";
import Loader from "../Loader/Loader";
import { useDeleteUser } from "../../query/mutations";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { data: user, isLoading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  if (isLoading) return <Loader size={86} />;

  return (
    <div className="profile-page">
      <div className="profile-page__card">
        <span className="profile-page__greeting">
          {getGreeting()}, <b>{user?.name}</b>!
        </span>
        <div className="profile-page__info">
          <div>
            <span className="profile-page__label">Имя:</span> {user?.name}
          </div>
          <div>
            <span className="profile-page__label">Почта:</span> {user?.email}
          </div>
          <div>
            <span className="profile-page__label">С вами с:</span>{" "}
            {user?.createdAt ? formatDate(user.createdAt) : ""}
          </div>
        </div>
        <div className="profile-page__motivation">
          {user?.createdAt && (
            <>
              <span>
                Вы на пути к лучшей версии себя уже с{" "}
                {formatDate(user.createdAt)}.<br />
                Каждый день — шаг к свободе от вредных привычек!
              </span>
            </>
          )}
        </div>
        <Link to="/edit/profile" className="profile-page__edit-link">
          Редактировать профиль
        </Link>
        <button
          className="profile-page__delete-btn"
          onClick={() => setShowModal(true)}
        >
          Удалить профиль
        </button>
      </div>
      {showModal && (
        <ConfirmationModal
          title="Вы точно хотите удалить профиль?"
          confirmText="Удалить"
          cancelText="Отмена"
          isPending={isPending}
          onConfirm={async () => {
            await deleteUser(user._id);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
