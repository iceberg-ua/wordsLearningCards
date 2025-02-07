import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSelector.css';

interface LanguageSelectorProps {
    isAddingLanguage: boolean;
    setIsAddingLanguage: (isAdding: boolean) => void;
}

const LanguageSelector = ({ isAddingLanguage, setIsAddingLanguage }: LanguageSelectorProps) => {
    const { languages, selectedLanguage, setSelectedLanguage, addLanguage } = useLanguage();
    const [newLanguage, setNewLanguage] = useState('');

    const handleAddLanguage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newLanguage.trim()) {
            const addedLanguage = await addLanguage(newLanguage.trim());
            if (addedLanguage) {
                setSelectedLanguage(addedLanguage);
            }
            setNewLanguage('');
            setIsAddingLanguage(false);
        }
    };

    return (
        <>
            <div className="language-selector">
                <select
                    value={selectedLanguage?.id || ''}
                    onChange={(e) => {
                        const language = languages.find(l => l.id === e.target.value);
                        if (language) setSelectedLanguage(language);
                    }}
                >
                    <option value="">Select Language</option>
                    {languages.map(language => (
                        <option key={language.id} value={language.id}>
                            {language.name}
                        </option>
                    ))}
                </select>
            </div>

            {isAddingLanguage && (
                <div className="add-language-modal">
                    <form onSubmit={handleAddLanguage} className="add-language-form">
                        <h2>Add New Language</h2>
                        <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Enter language name"
                            autoFocus
                        />
                        <div className="form-buttons">
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setIsAddingLanguage(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default LanguageSelector; 