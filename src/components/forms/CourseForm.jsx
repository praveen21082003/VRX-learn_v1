import React, { useState, useCallback } from 'react'
import { Input, SearchSelect, TextEditor, Icon, Button} from '@/components/ui'

import useDebouncedSearch from './hooks/useDebouncedSearch';

import { searchUser } from '../../services/AdminSearch.service';

function CourseForm({mode=true, isUpdating}) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        longDescription: "",
        trainerId: ""
    })


    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({
            username_or_email: query,
            role
        });
    }, []);

    const memoizedParams = useMemo(() => ({
        role: "trainer"
    }), []);

    const { search, setSearch, results, searching } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedParams
    });





    // Handle Change Fuction 
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }



    return (
        <form className="space-y-4">
            <Input
                label="Title"
                placeholder="Enter course title"
                paddingClass="p-2"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
            // inputWarning={warnings.title}
            />

            <SearchSelect
                label="Trainers"
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    if (!value) {
                        handleChange("trainerId", "");
                    }
                }}
                results={results}
                loading={searching}
                getLabel={(item) => item.username}
                getSubLabel={(item) => item.email}
                onSelect={(item) => {
                    handleChange("trainerId", item.id);
                    setSearch(item.username);
                }}
            // inputWarning={warnings.trainerId}
            />

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Short Description</label>
                <textarea
                    rows={4}
                    className="w-full p-3 rounded-md  text-sm leading-relaxed resize-none overflow-hidden border  focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Briefly describe what this course covers (minimum 50 characters if provided)"
                    value={formData.shortDescription || ""}
                    onChange={(e) => handleChange("shortDescription", e.target.value)}
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />
                {/* {warnings.shortDescription && <InputWarnMessage message={warnings.shortDescription} />} */}
            </div>
            {!isOpen &&
                <div className="flex justify-between" onClick={() => setIsOpen((prev) => !prev)}>
                    <label className="text-h5">Add Long Description<span className="text-caption">(optional)</span></label>
                    <Icon name="iconamoon:arrow-down-2" />
                </div>
            }

            {isOpen &&
                <div>
                    <label className="text-h5">Description</label>
                    <TextEditor
                        value={formData.longDescription}
                        onChange={(value) => handleChange("longDescription", value)}
                        // inputWarning={warnings.longDescription}
                        placeholder="Provide a detailed description of the course, including key topics and outcomes"
                    />
                </div>
            }

          
            {/* Actions */}
            <div className="flex w-full gap-3">
                <Button
                    buttonName="Cancel"
                    className="px-4 py-2 rounded-lg w-full"
                    bgClass=""
                    textClass=""
                />
                <Button
                    buttonName={mode ? isUpdating ? "Updating..." : "Save Changes" : isCreating ? "Creating..." : "Add Course"}
                    className="px-4 py-2 rounded-lg w-full"
                    // onClick={handleSubmit}
                    type="submit"
                />
            </div>
        </form>
    )
}

export default CourseForm
