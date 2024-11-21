enum Rank {
    Private = "Στρατιώτης",
    LanceCorporal = "Υποδεκανέας",
    Corporal = "Δεκανέας",
    Sergeant = "Λοχίας",
    StaffSergeant = "Επιλοχίας",
    MasterSergeant = "Αρχιλοχίας",
    WarrantOfficer = "Ανθυπασπιστής",
    ReserveOfficerCadet = "Δόκιμος Έφεδρος Αξιωματικός",
    SecondLieutenant = "Ανθυπολοχαγός",
    Lieutenant = "Υπολοχαγός",
    Captain = "Λοχαγός",
    Major = "Ταγματάρχης",
    LieutenantColonel = "Αντισυνταγματάρχης",
    Colonel = "Συνταγματάρχης",
    Brigadier = "Ταξίαρχος",
    MajorGeneral = "Υποστράτηγος",
    LieutenantGeneral = "Αντιστράτηγος",
    General = "Στρατηγός",
}

interface User {
    id: number;
    ldapId: string;
    name: string;
    isAdmin: boolean;
    dateOfDismissal?: string;
    rank: Rank;
    points?: number;
}

interface UserResponse {
    user?: User;
    isLoading: boolean;
}

const user: User = {
    id: 3,
    ldapId: "gep",
    name: "Στρατιώτης(ΕΠ) Θανάς Λεράι",
    isAdmin: false,
    dateOfDismissal: "2024-12-14",
    rank: Rank.Private,
    points: 0,
};

const adminUser: User = {
    id: 1,
    ldapId: "pasxalisk",
    name: "Τχης(ΕΠ) Πασχάλης Κυρανούδης",
    isAdmin: true,
    rank: Rank.Major,
};

const users = [undefined, user, adminUser];

export const useUser = (): UserResponse => {
    return {
        isLoading: false,
        user: users[2],
    };
};
