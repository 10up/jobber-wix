import React, { useState } from 'react';
import Modal from 'react-modal';

const Page: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDisconnecting, setIsDisconnecting] = useState(false);

	return (
		<Modal
			isOpen={isModalOpen}
			onRequestClose={() => setIsModalOpen(false)}
			shouldCloseOnOverlayClick={!isDisconnecting}
		>
			{/* Modal content */}
		</Modal>
	);
};

export default Page;
