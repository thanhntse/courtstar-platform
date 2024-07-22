import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import axiosInstance from "../../../../config/axiosConfig";
import Dropdown from "../../../../components/dropdown";
import Button from "../../../../components/button";
import PopupModal from "../../../../components/PopupModal";

function EditStaff(props) {
    const { t } = useTranslation();
    const [centres, setCentres] = useState([]);
    const [selectedCentre, setSelectedCentre] = useState(null);
    const dropdownRef = useRef();

    useEffect(() => {
        // Fetch the list of centers
        axiosInstance.get('/courtstar/centre/getAllCentresOfManager')
            .then(response => {
                const centresList = response.data.data.map(centre => ({
                    key: centre.id,
                    label: centre.name
                }));
                setCentres(centresList);
            })
            .catch(error => {
                console.log(error.message);
                toast.error(error.message, {
                    toastId: 'fetch-centres-error'
                });
            });
    }, []);

    const handleSelectCentre = (item) => {
        if (item) {
            setSelectedCentre(item.key);
        }
    };

    const handleClose = () => {
        props.setIsOpen();
    };

    const submit = async () => {
        console.log("Selected Centre:", selectedCentre); // Debugging log
        axiosInstance.put(`/courtstar/staff/move/centre/${props.staffId}/${selectedCentre}`)
            .then(res => {
                toast.success("Staff moved successfully!", {
                    toastId: 'move-staff-success'
                });
                window.location.reload();
            })
            .catch(error => {
                console.log(error.message);
                toast.error(error.message, {
                    toastId: 'move-staff-error'
                });
            });
    }

    const html = (
        <div className="flex flex-col gap-4 p-3 w-80 overflow-y-auto">
            <Dropdown
                ref={dropdownRef}
                items={centres}
                placeholder={t('selectCentre')}
                onSelect={handleSelectCentre}
                label={'Centre:'}
                className=''
            />
            <Button
                onClick={submit}
                label={t('Submit')}
                fullWidth
                fullRounded
                size='medium'
                className='bg-primary-green hover:bg-teal-900 text-white'
            />
        </div>
    );

    return (
        <div>
            <PopupModal
                html={html}
                isOpen={props.isOpen}
                setIsOpen={handleClose}
                title={t('moveStaff')}
                centreInfo
            />
        </div>
    );
}

export default EditStaff;
